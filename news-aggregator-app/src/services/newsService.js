const axios = require('axios');
const ExternalAPISource = require('../models/ExternalAPISource');
const Category = require('../models/Category');
const Article = require('../models/Article');

class NewsService {
  /**
   * Normalizes an article from an external API into our standard format.
   * @param {object} article - The raw article object from the external API.
   * @param {string} sourceName - The name of the source (e.g., 'NewsAPI').
   * @returns {object|null} A normalized article object or null if invalid.
   */
  _normalizeArticle(article, sourceName) {
    // Trim whitespace and convert to a known key for comparison
    const sourceKey = sourceName.trim(); 

    let normalized = {
      title: null,
      description: null,
      url: null,
      publishedAt: null,
      categoryName: null, // Default to null
    };

    if (sourceKey === 'NewsAPI') {
      if (!article.title || !article.url || article.title === '[Removed]') return null;
      normalized.title = article.title;
      normalized.description = article.description || article.title;
      normalized.url = article.url;
      normalized.publishedAt = article.publishedAt;
      normalized.categoryName = 'Business'; // This endpoint is always business
    } else if (sourceKey === 'The News API') {
      if (!article.title || !article.url) return null;
      normalized.title = article.title;
      normalized.description = article.snippet || article.description || article.title;
      normalized.url = article.url;
      normalized.publishedAt = article.published_at;
      // Use the first category provided, or default to 'General'
      normalized.categoryName = article.categories.length > 0 ? article.categories[0] : 'General';
    } else {
      // If the source is unknown, we can log it and assign a default category
      console.warn(`Unknown news source found: '${sourceKey}'. Assigning 'General' category.`);
      normalized.title = article.title; // Assume a generic title field
      normalized.description = article.description || '';
      normalized.url = article.url;
      normalized.publishedAt = article.publishedAt || new Date();
      normalized.categoryName = 'General';
    }

    // Final check to ensure we have a category name before returning
    if (!normalized.categoryName) {
      normalized.categoryName = 'General';
    }
    
    return normalized;
  }

  /**
   * Fetches news from all active external APIs.
   */
  async fetchAndStoreNews() {
    console.log('Starting news fetch process...');
    // 1. Get all active API sources from our database
    const activeSources = await ExternalAPISource.find({ status: 'Active' });

    if (!activeSources.length) {
      console.log('No active news sources found.');
      return;
    }

    let allNormalizedArticles = [];

    // 2. Loop through each active source
    for (const source of activeSources) {
      // These are the specific endpoints from your project document 
      const endpoints = {
        'NewsAPI': `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${source.apiKey}`,
        'The News API': `https://api.thenewsapi.com/v1/news/top?api_token=${source.apiKey}&locale=us&limit=3`
      };
      
      const endpoint = endpoints[source.name];
      if (!endpoint) continue;

      try {
        console.log(`Fetching from ${source.name}...`);
        const response = await axios.get(endpoint);
        const articles = source.name === 'NewsAPI' ? response.data.articles : response.data.data;
        
        console.log(`Found ${articles.length} articles from ${source.name}.`);

        // 3. Normalize the data
        for (const rawArticle of articles) {
          const normalizedArticle = this._normalizeArticle(rawArticle, source.name);
          if (normalizedArticle) {
            allNormalizedArticles.push({
              ...normalizedArticle,
              sourceName: source.name, // Add source name for later processing
            });
          }
        }

        // Update the lastAccessed timestamp for the source
        source.lastAccessed = new Date();
        await source.save();

      } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error.message);
      }
    }

     let savedCount = 0;
    for (const article of allNormalizedArticles) {
      try {
        // Find or create the category and get its ID
        const category = await Category.findOneAndUpdate(
          { name: { $regex: `^${article.categoryName}$`, $options: 'i' } },
          { $set: { name: article.categoryName } },
          { upsert: true, new: true }
        );

        // Prepare the final article document for our database
        const articleData = {
          title: article.title,
          description: article.description,
          url: article.url,
          publishedAt: article.publishedAt,
          categoryId: category._id, // Use the category's database ID
          sourceId: article.sourceId
        };
        
        // Use "upsert" to insert the article if it's new, or do nothing if URL exists.
        // We use updateOne instead of create to prevent errors on duplicate URLs.
        const result = await Article.updateOne(
          { url: article.url }, 
          { $setOnInsert: articleData }, 
          { upsert: true }
        );
        
        if (result.upsertedCount > 0) {
          savedCount++;
        }

      } catch (error) {
        // This can happen if two fetches run at once, which is fine.
        if (error.code !== 11000) { // 11000 is the duplicate key error code
          console.error('Error saving article to DB:', error.message);
        }
      }
    }
    
    console.log(`News fetch process complete. Saved ${savedCount} new articles.`);
    return { message: `Process complete. Saved ${savedCount} new articles.` };
  }
}

module.exports = new NewsService();
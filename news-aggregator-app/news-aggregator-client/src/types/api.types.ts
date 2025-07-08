export interface Credentials {
    email: string;
    password: string;
}
  
export interface UserData extends Credentials {
    username: string;
}

export interface HeadlineFilters {
    category?: string;
    startDate?: string;
    endDate?: string;
}

export interface SearchFilters extends HeadlineFilters {
    query: string;
    sortBy?: string;
}


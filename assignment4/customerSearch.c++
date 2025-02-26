using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public class CustomerSearch
{
    public List<Customer> SearchByCountry(string country)
    {
        var query = from customer in db.customers
                    where customer.Country.Contains(country)
                    orderby customer.CustomerID ascending
                    select customer;
        return query.ToList();
    }

    public List<Customer> SearchByCompanyName(string company)
    {
        var query = from customer in db.customers
                    where customer.Country.Contains(company)
                    orderby customer.CustomerID ascending
                    select customer;
        return query.ToList();
    }

    public List<Customer> SearchByContact(string contact)
    {
        var query = from customer in db.customers
                    where customer.Country.Contains(contact)
                    orderby customer.CustomerID ascending
                    select customer;
        return query.ToList();
    }

    public string ExportToCSV(List<Customer> customerData)
    {
        StringBuilder csvBuilder = new StringBuilder();
        foreach (var customer in customerData)
        {
            csvBuilder.AppendFormat("{0},{1},{2},{3}", customer.CustomerID, customer.CompanyName, customer.ContactName, customer.Country);
            csvBuilder.AppendLine();
        }
        return csvBuilder.ToString();
    }
}

export class CountryData {
    Country: string;
    CountryCode : string;
    Slug: string;
    NewConfirmed : number;
    TotalConfirmed : number;
    NewDeaths : number;
    TotalDeaths : number;
    NewRecovered : number;
    TotalRecovered : number;
    Date:string;


    constructor(
        country: string,
        countryCode : string,
        slug: string,
        newConfirmed : number,
        totalConfirmed : number,
        newDeaths : number,
        totalDeaths : number,
        newRecovered : number,
        totalRecovered : number,
        date:string
    ){
        this.Country = country;
        this.CountryCode = countryCode;
        this.Slug = slug;
        this.NewConfirmed = newConfirmed;
        this.TotalConfirmed = totalConfirmed;
        this.NewDeaths = newDeaths;
        this.TotalDeaths = totalDeaths;
        this.NewConfirmed = newConfirmed;
        this.NewRecovered = newRecovered;
        this.TotalRecovered = totalRecovered;
        this.Date = date;


    }
}
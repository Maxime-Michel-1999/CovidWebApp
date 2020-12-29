export class WorldData {

    
    NewConfirmed : number;
    TotalConfirmed : number;
    NewDeaths : number;
    TotalDeaths : number;
    NewRecovered : number;
    TotalRecovered : number;
    Global: WorldData;
    

    constructor(
        newConfirmed : number,
        totalConfirmed : number,
        newDeaths : number,
        totalDeaths : number,
        newRecovered : number,
        totalRecovered : number
    ){
        this.NewConfirmed = newConfirmed;
        this.TotalConfirmed = totalConfirmed;
        this.NewDeaths = newDeaths;
        this.TotalDeaths = totalDeaths;
        this.NewRecovered = newRecovered;
        this.TotalRecovered = totalRecovered;


    }
}
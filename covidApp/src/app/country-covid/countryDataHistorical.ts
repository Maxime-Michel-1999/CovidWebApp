
export class countryDataHistorical{

    country : string;
    province : [];
    timeline : {
        cases : {
        }

        deaths : {
        }

        recovered : {
        }
    }
    date : string;

    constructor(
        Country : string,
        Province : [],
        Timeline : {cases : object,
        deaths : object,
        recovered : object
        },
        Date : string
    ){

        this.country = Country;
        this.province = Province;
        this.timeline = Timeline;
        this.date = Date;
        }
    }







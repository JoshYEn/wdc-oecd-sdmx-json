(function () {
    var myConnector = tableau.makeConnector();
    var debug = true;
    var mainString = "https://stats.oecd.org/SDMX-JSON/data/AIR_GHG"
    var couData = [{"id":"AUS","name":"Australia"},{"id":"AUT","name":"Austria"},{"id":"BEL","name":"Belgium"},{"id":"CAN","name":"Canada"},{"id":"CZE","name":"Czech Republic"},{"id":"DNK","name":"Denmark"},{"id":"FIN","name":"Finland"},{"id":"FRA","name":"France"},{"id":"DEU","name":"Germany"},{"id":"GRC","name":"Greece"},{"id":"HUN","name":"Hungary"},{"id":"ISL","name":"Iceland"},{"id":"IRL","name":"Ireland"},{"id":"ITA","name":"Italy"},{"id":"JPN","name":"Japan"},{"id":"KOR","name":"Korea"},{"id":"LUX","name":"Luxembourg"},{"id":"MEX","name":"Mexico"},{"id":"NLD","name":"Netherlands"},{"id":"NZL","name":"New Zealand"},{"id":"NOR","name":"Norway"},{"id":"POL","name":"Poland"},{"id":"PRT","name":"Portugal"},{"id":"SVK","name":"Slovak Republic"},{"id":"ESP","name":"Spain"},{"id":"SWE","name":"Sweden"},{"id":"CHE","name":"Switzerland"},{"id":"TUR","name":"Turkey"},{"id":"GBR","name":"United Kingdom"},{"id":"USA","name":"United States"},{"id":"CHL","name":"Chile"},{"id":"EST","name":"Estonia"},{"id":"ISR","name":"Israel"},{"id":"RUS","name":"Russia"},{"id":"SVN","name":"Slovenia"},{"id":"LVA","name":"Latvia"},{"id":"LTU","name":"Lithuania"},{"id":"OECD","name":"OECD - Total"},{"id":"OECDE","name":"OECD - Europe"},{"id":"BRA","name":"Brazil"},{"id":"CHN","name":"China (People's Republic of)"},{"id":"COL","name":"Colombia"},{"id":"CRI","name":"Costa Rica"},{"id":"IND","name":"India"},{"id":"IDN","name":"Indonesia"},{"id":"ZAF","name":"South Africa"},{"id":"ARG","name":"Argentina"},{"id":"EU28","name":"European Union (28 countries)"},{"id":"OECDAO","name":"OECD Asia Oceania"},{"id":"OECDAM","name":"OECD America"},{"id":"NMEC","name":"dummy???"}];
    var polData = [{"id":"GHG","name":"Greenhouse gases"},{"id":"CO2","name":"Carbon dioxide"},{"id":"CH4","name":"Methane"},{"id":"N2O","name":"Nitrous oxide"},{"id":"HFC","name":"Hydrofluorocarbons"},{"id":"PFC","name":"Perfluorocarbons"},{"id":"SF6","name":"Sulphur hexafluoride"},{"id":"NF3","name":"Nitrogen trifluoride"},{"id":"HFC_PFC","name":"Unspecified mix of HFCs and PFCs"}];
    var varData = [{"id":"TOTAL","name":"Total  emissions excluding LULUCF"},{"id":"INDEX_1990","name":"Total GHG excl. LULUCF, Index 1990=100"},{"id":"GHG_CAP","name":"Total GHG excl. LULUCF per capita"},{"id":"ENER","name":"1 - Energy"},{"id":"AGR","name":"3 - Agriculture"},{"id":"IND_PROC","name":"2- Industrial processes and product use"},{"id":"WAS","name":"5 - Waste"},{"id":"GHG_GDP","name":"Total GHG excl. LULUCF per unit of GDP"},{"id":"LULUCF","name":"Land use, land-use change and forestry (LULUCF)"},{"id":"ENER_IND","name":"1A1 - Energy Industries"},{"id":"ENER_OSECT","name":"1A4 - Residential and other sectors"},{"id":"ENER_MANUF","name":"1A2 - Manufacturing industries and construction"},{"id":"ENER_OTH","name":"1A5 - Energy - Other"},{"id":"ENER_FU","name":"1B - Fugitive Emissions from Fuels"},{"id":"ENER_TRANS","name":"1A3 - Transport"},{"id":"OTH","name":"6 - Other"},{"id":"INDEX_2000","name":"Total GHG excl. LULUCF, Index 2000=100"},{"id":"TOTAL_LULU","name":"Total  emissions including LULUCF"},{"id":"ENER_CO2","name":"1C - CO2 from Transport and Storage"},{"id":"ENER_TRANS_P","name":"1A3 - Transport"},{"id":"AGR_P","name":"3 - Agriculture"},{"id":"ENER_FU_P","name":"1B - Fugitive Emissions from Fuels"},{"id":"WAS_P","name":"5 - Waste"},{"id":"ENER_P","name":"1 - Energy"},{"id":"ENER_OSECT_P","name":"1A4 - Residential and other sectors\t"},{"id":"IND_PROC_P","name":"2- Industrial processes and product use"},{"id":"OTH_P","name":"6 - Other"},{"id":"ENER_IND_P","name":"1A1 - Energy Industries"},{"id":"ENER_MANUF_P","name":"1A2 - Manufacturing industries and construction"},{"id":"ENER_OTH_P","name":"1A5 - Energy - Other"},{"id":"ENER_CO2_P","name":"1C - CO2 from Transport and Storage"}];

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "COU",
            alias: "Country",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "POL",
            alias: "Pollutant",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "VAR",
            alias: "Variable",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "TIME_PERIOD",
            alias: "Year",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "OBS",
            alias: "Observation",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "UNI",
            alias: "Unit",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "OECD_GHG_Emissions",
            alias: "GHG Emissions",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {
        var impSetting = JSON.parse(tableau.connectionData), // imported connection data from wdc page
            counString = couData[0].id,
            poluString = polData[0].id,
            variString = varData[0].id,
            yearString = "startTime=" + impSetting.startDate + "&endTime=" + impSetting.endDate;

        // Generating country string
        if (impSetting.COUSelection) {
            console.log("COU selection is on.");
        } else {
            for (var i = 1, len = Object.keys(couData).length; i < len; i++) {
                counString = counString + "+" + couData[i].id;
            }
        }
        // Generating pollutant string
        if (impSetting.POLSelection) {
            console.log("POL selection is on.");
        } else {
            for (var i = 1, len = Object.keys(polData).length; i < len; i++) {
                poluString = poluString + "+" + polData[i].id;
            }
        }

        // Generating variable string
        if (impSetting.VARSelection) {
            console.log("VAR selection is on.");
            variString = "TOTAL+ENER+ENER_IND+ENER_MANUF+ENER_TRANS+ENER_OSECT+ENER_OTH+ENER_FU+IND_PROC+AGR+WAS+OTH+LULUCF+AFOLU+TOTAL_LULU"
        } else {
            for (var i = 1, len = Object.keys(varData).length; i < len; i++) {
                variString = variString + "+" + varData[i].id;
            }
        }

        var queryString = mainString + "/" + counString + "." + poluString + "." + variString + "/all?" + yearString + "&dimensionAtObservation=allDimensions";

        // Get JSON
        $.getJSON(queryString, function (resp) {
            if (debug) console.log('retrieved all measurements: %o', resp);

            var obsvs = resp.dataSets[0].observations,
                tableData = [];

            if (debug) {
                console.log('size of loaded database: +', Object.keys(obsvs).length);
                console.log('start loading...');
            }

            for (var i = 0, len = Object.keys(obsvs).length; i < len; i++) {
                var arrKey = Object.keys(obsvs)[i].split(':');
                tableData.push({
                    "COU": resp.structure.dimensions.observation[0].values[arrKey[0]].name,
                    "POL": resp.structure.dimensions.observation[1].values[arrKey[1]].name,
                    "VAR": resp.structure.dimensions.observation[2].values[arrKey[2]].name,
                    "TIME_PERIOD": resp.structure.dimensions.observation[3].values[arrKey[3]].name,
                    "OBS": obsvs[Object.keys(obsvs)[i]][0],
                    "UNI": resp.structure.attributes.observation[2].values[obsvs[Object.keys(obsvs)[i]][3]].name
                });
            }

            if (debug) {
                console.log("Import done...");
            }

            table.appendRows(tableData);
            doneCallback();
        });

    };

    tableau.registerConnector(myConnector);

    $(document).ready(function() {
        $("#submitButton").click(function() {
            var impSetting = {
                startDate: $('#start-year').val().trim(),
                endDate: $('#end-year').val().trim(),
                COUSelection: $('#countrySelection').is(':checked'),
                VARSelection: $('#variablSelection').is(':checked'),
                POLSelection: $('#polluteSelection').is(':checked')
            };

            // Simple date validation: Call the getDate function on the date object created
            function isValidDate(dateStr) {
                var d = new Date(dateStr);
                return !isNaN(d.getDate());
            }

            if (isValidDate(impSetting.startDate) && isValidDate(impSetting.endDate)) {
                tableau.connectionData = JSON.stringify(impSetting); // Use this variable to pass data to your getSchema and getData functions
                tableau.connectionName = "USGS Earthquake Feed"; // This will be the data source name in Tableau
                tableau.submit(); // This sends the connector object to Tableau
            } else {
                $('#errorMsg').html("Enter valid year. For example, 2016.");
            }
        });
    });
})();
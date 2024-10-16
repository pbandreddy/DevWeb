load.initialize("Initialize", async function () {
});

load.action("Action", async function () {

    let T01 = new load.Transaction("Shopping");
    load.thinkTime(2 + Math.random());

    T01.start();
    const Shopping = new load.WebRequest({
        url: `${load.params.url}/app/tempFiles/popularProducts.json`,
        method: "GET",
        returnBody: true,
        extractors: [
            new load.BoundaryExtractor("Bou_product","productName\": \"","\""),
            new load.BoundaryExtractor("Bou_Product_options", {
                leftBoundary: "productName\": \"",
                rightBoundary: "\"",
                occurrence: 2
            }),
            new load.RegexpExtractor("reg_product", "productName\": \"(.*?)\""),
            new load.RegexpExtractor("reg_product_options", {
                expression: "productName\": \"(.*?)\"",
                occurrence: load.ExtractorOccurrenceType.First
            }),
            new load.JsonPathExtractor("json_product", "$[*].productName",true),
            new load.JsonPathExtractor("json_product_options", {
                path: "$[*].productName",
                returnMultipleValues: true
            }),
        ]
    });

    const Shopping_Response = Shopping.sendSync();
    if(Shopping_Response.status === 200 && Shopping_Response.textCheck('TABLET')) {
        load.log("Test Passed.", load.LogLevel.info);
        T01.stop(load.TransactionStatus.Passed);
    } else {
        load.log("Test Failed.", load.LogLevel.error);
        T01.stop(load.TransactionStatus.Failed);
    }

    const auth = new load.WebRequest({
        url: "https://developer-stg.api.com/authentication/v2/token",
        method: "POST",
        returnBody: true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {
            "client_id": load.decrypt(""),
            "client_secret": load.decrypt(""),
            "grant_type": "client_credentials",
            "scope": "data:read"
        },
    }).sendSync();
});

load.finalize("Finalize", async function () {
});


OfflineGenerator.exe -mode=har -level=pages

DevWebUtils -mode=genKey -keyLocation=generatedKey.txt Passphrase
DevWebUtils -mode=enc -keyLocation=generatedKey.txt passcode


load.decrypt("")

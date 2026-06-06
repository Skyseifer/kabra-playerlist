exports.handler = async () => {
    try {

        const response = await fetch(
            "http://45.236.90.175:20001/players.json"
        );

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

    } catch (error) {

        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                error: "No se pudieron obtener los jugadores",
                details: error.message
            })
        };

    }
};
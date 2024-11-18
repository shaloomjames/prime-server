    const mongoose = require("mongoose");


    const ConnectDB = async()=>{
        try {
            const conn = await mongoose.connect("mongodb://admin:admin@clustervertex-shard-00-00.fr2hb.mongodb.net:27017,clustervertex-shard-00-01.fr2hb.mongodb.net:27017,clustervertex-shard-00-02.fr2hb.mongodb.net:27017/ExpanceDb?ssl=true&replicaSet=atlas-rj523g-shard-0&authSource=admin&retryWrites=true&w=majority&appName=ClusterVertex");
            console.log(`server is connected to ${conn.connection.db.databaseName} database`)
        } catch (error) {
            console.log(`Db Connection Error ${error}`)
        }
    }

    module.exports = ConnectDB;

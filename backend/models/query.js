const pool=require('./db')

async function fetchVendor(){
    try{
        const result=await pool.query("select * from vendors")
        console.log(result.rows)
    }
    catch(err){
        console.error("DB Error:", err);
    }
}

fetchVendor()
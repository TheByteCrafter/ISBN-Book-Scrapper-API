const axios =require("axios");
const cheerio=require("cheerio");

module.exports=async(req,res)=>{
    const {isbn}=req.query;

    const fetchTextBookCenter=async()=>{
        try{
            const response=await
            axios.get("https://www.textbookcenter.com/search/?q=${isbn}");

            const $=cheerio.load(response.data);
            const title=$('.product-title').first().text().trim();
            const authors=$('.product-author').first().text().trim();

            if (title && authors){
                return {
                    title,
                    authors:authors.split(',').map(a=>a.trim()),
                    source:'text Book Center'
                };
            }
        }catch(err){
            console.error("Tbc eror:",err.message);
        }
        return null;
    };

    //more scap sources here



    const sources=[
        fetchTextBookCenter()
        //more here
    ];

    const results=await Promise.all(sources);
    const book=results.find(b=>b!==null);

    if (book){

    
        res.status(200).json(book);

    }else{
        res.status(400).json({message:"Book not found"});
    }

};
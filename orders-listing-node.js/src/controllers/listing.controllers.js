const { Category } = require("@prisma/client");
const prisma = require("../database/db.connect");
const IMAGE_BASE_URL = require("../utils/baseurls.utils");

//This route will be able to add the item into the database.
module.exports.addItems = async(req, res)=>{

    //Getting all the details for the body.
    const { name, description, tag, price, quantity, category, subcategory } = req.body;

    //Creating the slug here.
    const newSlug = `${name.split(' ').join('-').toLowerCase().trim()}-${tag}-${subcategory.toLowerCase()}`
    

    //Handling files here.
    if(!req.files){
        return res.status(400).json({
            success: false,
            message: "Images are required"
        })
    }

    //Creating array to save the database.
    let imageLinks = []; 

    //Creating the links of the images and adding it into the array and saving
    req?.files?.map((file)=>{
        const accessableLink = `${IMAGE_BASE_URL}/${file.filename}`
        imageLinks.push(accessableLink)
    });

    //Saving the links into the database.
    try {
        const item = await prisma.items.create({
            data: {
                name,
                description,
                tag,
                category,
                subcategory,
                quantity : parseInt(quantity),
                price : parseFloat(price),
                slug : newSlug,
                image : imageLinks,
            }
        });

        if(item){
            return res.status(200).json({
                success: true,
                message: "Item added successfully"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        }); 
    } 
}


//This route will be able to fetch all the item present in the database.
module.exports.fetchItems = async(req, res)=>{
    
    //Getting the pagination details from the query.
    const page = parseInt(req.query.page, 10) || 1; 
    const limit = parseInt(req.query.limit, 10) || 10;

    //Getting all the filters based on category and subcategory.
    const categoryFilter = req.query.category;
    const subCategoryFilter = req.query.subcategory;

    //Making the filter object.
    let filter = {
        isActive : true
    }

    //Adding the category object if exists
    if(categoryFilter){
        filter.category = categoryFilter
    }

    //Adding the sub-category object if exists
    if(subCategoryFilter){
        filter.subcategory = subCategoryFilter
    }

    //Calculating the offset.
    const offset = (page - 1) * limit;

    try {
        //Finding our the count of the records in the database.
        const count = await prisma.items.count({
            where: filter
        });

        if(count === 0){
            return res.status(400).json({
                success: false,
                message: "No items found for the applied filters",
                data: {},
                metadata: {
                    page,
                    limit,
                    totalPages : Math.ceil(count / limit)
                }
            })
        }

        const items = await prisma.items.findMany({
            orderBy: {
                created_at: "desc"
            },
            where : filter,
            skip : offset,
            take : limit,
        });

        if(items){
            return res.status(200).json({
                success: true,
                data: items,
                metadata: {
                    page,
                    limit,
                    totalPages : Math.ceil(count / limit)
                }
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        }); 
    }
}


module.exports.activeItem = async(req, res)=>{

    //Getting the item details.
    const productId = req.query.id;

    //Validation check.
    if(!productId){
        return res.status(400).json({
            success: false,
            message: "Id not found"
        })
    }

    //activating the item in the database.
    try {
        const existingItem = await prisma.items.findUnique({ where: { id: productId } });

        if (!existingItem) {
            return res.status(404).json({ 
                success: false, 
                message: "Item not found" 
            });
        }

        const item = await prisma.items.update({
            where: {
                id: productId
            },
            data: {
                isActive: !existingItem.isActive
            }
        });

        return res.status(200).json({
            success: true,
            data: item,
            message: `Item is now ${item.isActive ? "active" : "inactive"}`
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        }); 
    }
}
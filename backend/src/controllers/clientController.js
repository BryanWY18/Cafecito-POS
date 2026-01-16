import Client from "../models/client.js";

const checkUserExist = async (phoneOrEmail) => {
  const client = await Client.findOne({ phoneOrEmail });
  return client;
}

const getClients = async(req,res,next)=>{
  try{
    const page = parseInt(req.query.page) || 1;
    console.log(page)
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const clients = await Client.find()
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    const totalResults = await Client.countDocuments();
    const totalPages = Math.ceil(totalResults / limit);

    res.json({
      clients,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  }catch(error){
    next(error);
  }
}

const getClientById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(client);
  } catch (error) {
    next(error);
  }
};

async function registerClient(req, res, next) {
  try {
    const { name, phoneOrEmail } = req.body;
    const userExist = await checkUserExist(phoneOrEmail);
    if (userExist) {
      return res.status(400).json({ message: 'Client already exist' });
    };
    const newClient = new Client({
      name,
      phoneOrEmail
    });
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    next(error);
  }
};

export{
  getClients,getClientById,registerClient,
};
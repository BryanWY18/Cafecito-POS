import Client from "../models/client.js";

const getClients = async(req,res,next)=>{
  try{
    const { name, page = 1, limit = 20 } = req.query;
    const clients = await User.find(name)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ _id: -1 });
       
    const total = await Client.countDocuments(filter);

    res.status(200).json({
      message: "Clients retrieved successfully",
      clients,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  }catch(error){
    next(error);
  }
}

const getClientById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await Client.findById(userId).select("-hashPassword");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "Client retrieved successfully",
      user,
    });
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
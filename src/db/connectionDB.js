import mongoose from 'mongoose';

const connectionDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/blog`);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error: ', error.message);
        process.exit(1);
    }
};

export default connectionDB;
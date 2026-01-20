const { MongoClient } = require('mongodb');

async function seed() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('volta');
        const collection = db.collection('cabledesigns');

        const designs = [
            {
                _id: 'cable-123',
                standard: 'IEC 60502-1',
                voltage: '0.6/1 kV',
                conductorMaterial: 'Cu',
                conductorClass: 'Class 2',
                csa: 10,
                insulationMaterial: 'PVC',
                insulationThickness: 1.0,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: 'cable-456',
                standard: 'IEC 60502-1',
                voltage: '0.6/1 kV',
                conductorMaterial: 'Al',
                conductorClass: 'Class 2',
                csa: 16,
                insulationMaterial: 'XLPE',
                insulationThickness: 0.7,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        for (const design of designs) {
            await collection.replaceOne({ _id: design._id }, design, { upsert: true });
        }

        console.log('Seeded MongoDB successfully');
    } catch (err) {
        console.error('Error seeding MongoDB:', err);
    } finally {
        await client.close();
    }
}

seed();

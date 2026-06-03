const mongoose = require('mongoose');

const uri = 'mongodb+srv://valueproservicesaws_db_user:hxxQeVu6s4RSA4w1@cluster0.lrsromf.mongodb.net/ValuePro';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected');
    const db = mongoose.connection.db;

    // isActive distribution
    const total    = await db.collection('services').countDocuments({});
    const active   = await db.collection('services').countDocuments({ isActive: true });
    const inactive = await db.collection('services').countDocuments({ isActive: false });
    const noField  = await db.collection('services').countDocuments({ isActive: { $exists: false } });

    console.log('\n=== SERVICES isActive breakdown ===');
    console.log('Total    :', total);
    console.log('isActive true  :', active);
    console.log('isActive false :', inactive);
    console.log('isActive missing:', noField);

    // Sample 5 docs
    console.log('\n=== SAMPLE SERVICE DOCS ===');
    const samples = await db.collection('services').find({}).limit(5).toArray();
    samples.forEach((s, i) => {
      console.log(`[${i+1}] name: "${s.name}" | category: "${s.category}" | isActive: ${JSON.stringify(s.isActive)}`);
    });

    // Distinct category values in services
    console.log('\n=== DISTINCT category values in services collection ===');
    const distinct = await db.collection('services').distinct('category');
    distinct.forEach(c => console.log(`  "${c}"`));

    // Category collection names
    console.log('\n=== CATEGORIES collection (name field) ===');
    const cats = await db.collection('categories').find({}).toArray();
    cats.forEach(c => console.log(`  "${c.name}"`));

    await mongoose.disconnect();
  })
  .catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
  });

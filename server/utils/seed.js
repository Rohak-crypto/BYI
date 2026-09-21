const { pool } = require("../config/db");

const seeds = [
  ["Luxury Wrist Watch","Fashion","Premium luxury wrist watch with a classic stainless-steel finish.",45000,"/assets/images/watch.jpg",2],
  ["Vintage Camera","Electronics","Classic vintage camera in excellent collectible condition.",22500,"/assets/images/camera.jpg",1],
  ["Antique Wooden Chair","Furniture","Beautiful handcrafted antique wooden chair.",12800,"/assets/images/chair.jpg",3],
  ["Diamond Necklace","Jewellery","Elegant diamond necklace presented in a premium jewellery case.",75000,"/assets/images/necklace.jpg",2],
  ["Classic Painting","Art & Collectibles","Decorative classic painting suitable for collectors.",60000,"/assets/images/painting.jpg",4],
  ["Vintage Car Model","Vehicles","Detailed vintage automobile collectible model.",280000,"/assets/images/car.jpg",1],
  ["Leather Handbag","Fashion","Premium leather handbag with timeless design.",18000,"/assets/images/handbag.jpg",2],
  ["Latest Smartphone","Electronics","Latest smartphone in excellent condition.",38000,"/assets/images/phone.jpg",1],
  ["Gramophone","Art & Collectibles","Classic gramophone collectible.",32000,"/assets/images/gramophone.jpg",3],
  ["Designer Sofa","Furniture","Premium designer sofa.",55000,"/assets/images/sofa.jpg",5]
];

async function seedAuctionsForUser(userId) {
  const [[count]] = await pool.query("SELECT COUNT(*) AS count FROM auctions");
  if (Number(count.count) > 0) return;
  for (const [title,category,description,price,image,days] of seeds) {
    await pool.query(
      `INSERT INTO auctions
       (seller_id,title,category,description,starting_price,current_bid,image_url,start_at,end_at,status)
       VALUES (?,?,?,?,?,?,?,NOW(),DATE_ADD(NOW(),INTERVAL ? DAY),'live')`,
      [userId,title,category,description,price,price,image,days]
    );
  }
}

module.exports = { seedAuctionsForUser };

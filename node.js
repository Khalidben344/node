// WhatsApp Bot (Node.js) - Multi-language + Admin Panel + Product Menu
// Ready for Render deployment

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

let products = [
  { id: 1, name: 'Product 1', price: '100 DH' },
  { id: 2, name: 'Product 2', price: '200 DH' }
];

const admins = ['212600000000@c.us']; // replace with your WhatsApp number

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Bot is ready');
});

client.on('message', async msg => {
  const text = msg.body.toLowerCase().trim();
  const sender = msg.from;

  if (text === 'bonjour' || text === 'salut' || text === 'start') {
    let menu = 'Bonjour 👋\n\nChoisissez un produit:\n';
    products.forEach(p => {
      menu += `${p.id}. ${p.name} - ${p.price}\n`;
    });
    menu += '\nEnvoyez le numéro du produit.';
    return msg.reply(menu);
  }

  const selected = products.find(p => p.id.toString() === text);
  if (selected) {
    return msg.reply(`💰 ${selected.name} = ${selected.price}\n\nEnvoyez PAY pour continuer.`);
  }

  if (admins.includes(sender)) {
    if (text.startsWith('add ')) {
      const data = msg.body.slice(4).split(',');
      if (data.length === 3) {
        const newProduct = {
          id: parseInt(data[0]),
          name: data[1].trim(),
          price: data[2].trim()
        };
        products.push(newProduct);
        return msg.reply('✅ Product added');
      }
    }
  }
});

client.initialize();

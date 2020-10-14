const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('./../models/bands');

const bands = new Bands();

bands.addBand( new Band( 'Queen') );
bands.addBand( new Band( 'Bon Jovi') );
bands.addBand( new Band( 'Héroes del Silencio') );
bands.addBand( new Band( 'Metallica') );

console.log( bands );
// mensajes de sockets
io.on('connection', client => {
    console.log( 'cliente conectado' );
    
    client.emit( 'active-bands', bands.getBands());
    client.on('disconnect', () => {
      console.log( 'cliente desconectado' );
    });
    
    client.on('mensaje', ( payload ) => {
      console.log('mensaje', payload);
  
      io.emit('mensaje', { admin: 'Nuevo mensaje'});
    });

    client.on('emitir-mensaje', (payload) => {
      console.log(payload);
      // io.emit('nuevo-mensaje', payload); // emite a todos los clientes
      client.broadcast.emit('nuevo-mensaje', payload ); // emite a todos los clientes excepto quien emitió
    });
    client.on('vote-band', (payload) => {
      bands.voteBand(payload.id);
      console.log( 'bands:  ', bands.getBands());
      // io.emit('nuevo-mensaje', payload); // emite a todos los clientes
      // client.broadcast.emit('vote-band', band.getBands() ); // emite a todos los clientes excepto quien emitió
      io.emit( 'active-bands', bands.getBands());
    });
    client.on('add-band', (payload) => {
      const newBand = new Band( payload.name );
      bands.addBand(newBand);
      io.emit( 'active-bands', bands.getBands());
    });
    client.on('delete-band', (payload) => {
      console.log( 'Band to delete(id): ', payload.id);
      bands.deleteBand(payload.id);
      io.emit( 'active-bands', bands.getBands());
    });

    
  });
  
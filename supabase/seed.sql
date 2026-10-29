-- Datos sintéticos de demostración. Conserva los registros existentes y evita duplicar nombres.
insert into public.productos(nombre,precio,stock)
select v.nombre,v.precio,v.stock from (values
 ('Portatil Lenovo',500,4),('portatil apple',900,98),
 ('Monitor Dell 24 pulgadas',189.90,12),('Teclado Logitech K380',44.95,24),
 ('Ratón inalámbrico HP',19.90,3),('Disco SSD Samsung 1 TB',89.90,8),
 ('Auriculares Sony WH-CH520',49.99,0),('Webcam Logitech C920',69.90,5),
 ('Hub USB-C Anker',39.95,17),('Impresora Brother láser',159.00,2),
 ('Memoria RAM Kingston 16 GB',42.50,14),('Cable HDMI 2 metros',8.95,45)
) v(nombre,precio,stock)
where not exists(select 1 from public.productos p where lower(btrim(p.nombre))=lower(v.nombre));

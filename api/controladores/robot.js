const asyncHandler = require('express-async-handler'); 
const crypto = require('crypto'); 
const fs = require('fs');
const streamifier = require('streamifier');

const pool = require('../configuraciones/database'); 
// TODO la url del directorio donde se suben los video, esto deberia estar en un config para que sea general
const URI_MEDIA = "/src/assets/media/"

function codificar(valor) {
	return valor.toString();
}
function decodificar(hash) {
	try {
		const valor = parseFloat(hash);
		console.log(valor);
		return valor; 
	} catch (err) {
		console.log('Error en la decodificacion', err);
		return NaN; 
	}
}

exports.obtener_platillo = asyncHandler(async (req, res, next) => {
	try {
		const id = req.params.id; 
		if (id<0) {
			res.status(500).json({
				message: 'Numero de pagina no valido'
			}); 
			return;
		} 
		const sql = 'SELECT ID_PLATILLO,TITULO_PLATILLO,DESCRIPCION_PLATILLO,IMAGEN_PLATILLO, URL_VIDEO FROM platillo_tipico ORDER BY TITULO_PLATILLO LIMIT ?, 1'; 
		const indexi = id-1; 

		const [result] = await pool.query(sql, indexi); 

		if (result.length == 0) {
			console.log('No se encontro el platillo');
			res.status(400).json({
				message: 'No se encontro el platillo'
			}); 
		} else {
			let platillo = result[0];
			const id_codificado =codificar(platillo.ID_PLATILLO); 
			platillo.ID_PLATILLO = id_codificado;
			const datos_imagen = platillo.IMAGEN_PLATILLO;
			let formato_imagen = 'jpeg';
			if (Buffer.isBuffer(datos_imagen) && datos_imagen>1) {
				if (datos_imagen[0]===0x89 && datos_imagen[1]==0x50) {
					formato_imagen = 'png';
				} 
			}
			const imagen_base_64 = platillo.IMAGEN_PLATILLO.toString('base64');
			const respuesta = {
				id: id_codificado,
				nombre: platillo.TITULO_PLATILLO,
				descripcion: platillo.DESCRIPCION_PLATILLO,
				imagen: `data:image/${formato_imagen};base64,${imagen_base_64}`,
				// TODO una vez obtenido el video concatenamos con la URL del directorio donde se subio
				video: URI_MEDIA + platillo.URL_VIDEO
			}
			res.json({respuesta});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Error del servidor', 
			error: err
		});
	}
});
// TODO ya no es necesario
exports.stream_video = asyncHandler (async (req, res) => {
	try {
		const id_codificado = req.params.id; 
		console.log(id_codificado)
		const id = decodificar(id_codificado);

		console.log('Llega luego de la decodificacion ', id_codificado, id);

		if (id==null || isNaN(id)) {
			res.status(400).json({
				message: 'Error en decodificacion del id'
			}); return;
		}
		const sql = 'SELECT URL_VIDEO FROM platillo_tipico WHERE ID_PLATILLO = ?'; 
		const [result] = await pool.query(sql, [id]); 
		console.log('Result ', result.length);

		if (result.length===0) {
			console.log('No se encontro el video'); 
			res.status(400).json({message: 'video no encontrado'});
		} else {
			//res = result[0].URL_VIDEO
			res.status(200).json({video: result[0].URL_VIDEO });
			//const video = result[0].URL_VIDEO; 			

			/*res.setHeader('Content-Type', 'video/mp4');
			res.setHeader('Accept-Ranges', 'bytes');

			const video_stream = streamifier.createReadStream(video);

			const rango = req.headers.range; 
			if (rango) {
				const partes = rango.replace(/bytes=/, '').split('-');
				const inicio = parseInt(partes[0], 10);
				const fin = partes[1]? parseInt(partes[1], 10): video.length-1; 
				const longitud = fin-inicio +1; 

				res.status(206);
				res.setHeader('Content-Length', longitud); 
				res.setHeader('Content-Range', `bytes ${inicio}-${fin}/${video.length}`); 
				video_stream.pipe(res, {inicio, fin}); 
			} else {
				res.setHeader('Content-Length', video.length);
				video_stream.pipe(res);
			} */
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Error del servidor',
			error: err
		})
	}
});
exports.insertar_platillo = asyncHandler(async (req, res) => {
	try {
		const nombre = req.body.nombre; 
		const descripcion = req.body.descripcion;
		// TODO Guardamos las imagenes solo el nombre, ya que se puede usar el mismo proceso del video en Imagenes 
		const imagen = "img.jpg" 
		/* req.files['imagen'][0].buffer;*/ 
		// TODO solo guardamos el nombre
		const video = "video.mp4" 
		/* req.files['video'][0].buffer;*/


		const query = 'INSERT INTO platillo_tipico(TITULO_PLATILLO,DESCRIPCION_PLATILLO,IMAGEN_PLATILLO,URL_VIDEO) VALUES(?,?,?,?)';

		const [result] = await pool.query(query, [nombre, descripcion, imagen, video]); 
		
		if (result.affectedRows >0 ) {
			res.status(200).json({
				message: 'Platillo registrado correctamente'
			})
		} else {
			res.status(500).json({
				message: 'Error en la base de datos'
			})
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Error interno del servidor general', 
			error: err
		})
	}
});
exports.modificar_platillo = asyncHandler(async (req, res) => {
	try {
		let id = req.params.id; 
		id = decodificar(id); 
		if (id==null) {
			res.status(500).json({
				message: 'Error con el servidor', 
				error: 'Error de decodificacion del id'
			})
		}
		const {nombre, descripcion} = req.body; 


		// TODO Modificar, cuando se hace update del platillo, hacer update de la foto y del video(solo nombre)
		// y si es posible borrar el antiguio video y foto

		const imagen = req.files['imagen'].buffer; 
		const video = req.files['video'].buffer; 

		const sql = 'UPDATE platillo_tipico SET NOMBRE_PLATILLO = ?, DESCRCIPCION =?, IMAGEN_PLATILLO = ?, URL_VIDEO = ? WHERE ID_PLATILLO = ?'; 
		const [result] = await pool.query(sql , [nombre, descripcion, imagen, video, id]); 

		if (result.affectedRows >0 ) {
			res.status(200).json({
				message: 'Platillo modificado correctamente'
			})
		} else {
			res.status(500).json({
				message: 'Error en la base de datos'
			})
		}
	} catch (err) {
		console.log(err); 
		res.status(500).json({
			message: 'Error del servidor', 
			error: err
		})
	}
});

// TODO adegurarse de eliminar todo, inclusive el video y la imagen desde el directorio destino
exports.eliminar_platillo = asyncHandler(async (req, res, next) => {
	try {
		let id = req.params.id; 
		id = decodificar(id);
		const sql = 'DELETE FROM platillo_tipico WHERE ID_PLATILLO = ?'
		const [result] = await pool.query(sql , [id]); 
		if (result.affectedRows >0 ) {
			res.status(200).json({
				message: 'Platillo eliminado correctamente'
			})
		} else {
			res.status(500).json({
				message: 'Error en la base de datos'
			})
		}
	} catch (err) {
		console.error(err); 
		res.status(500).json({
			message: 'Error del servidor'
		})
	}
});
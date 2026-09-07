import multer from "multer";

const storage = multer.diskStorage({});

// const imageUpload = multer({
// 	storage,
// 	limits: {
// 		fileSize: 10 * 1024 * 1024,
// 		files: 1,
// 	},
// 	fileFilter: (_request, file, callback) => {
// 		if (!file.mimetype.startsWith("image/")) {
// 			callback(new Error("Only image files are allowed."));
// 			return;
// 		}

// 		callback(null, true);
// 	},
// });

// export const uploadImage = imageUpload.single("image_file");

export const uploadImage=multer({storage});
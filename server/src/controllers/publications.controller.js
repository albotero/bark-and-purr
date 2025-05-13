import execute from "../controllers/execute.js";
import {
  getPublicationsByUser,
  getPublicationById,
  deletePublicationById,
  createPublication,
  updatePublication,
  addProductImage,
} from "../models/publication.models.js";

// Get all posts from the authenticated user
export const getPublications = async (req, res) => {
  await execute({
    res,
    success: 200,
    callback: async () => {
      const vendorId = req.user.id;
      return await getPublicationsByUser(vendorId);
    },
  });
};

// Get a post by ID
export const getPublicationByIdController = async (req, res) => {
  await execute({
    res,
    success: 200,
    args: req.params,
    callback: async ({ id }) => {
      const publication = await getPublicationById(id);

      if (!publication) {
        const error = new Error("Publication not found");
        error.status = 404;
        throw error;
      }

      if (publication.vendor_id !== req.user.id) {
        const error = new Error("Unauthorized access");
        error.status = 403;
        throw error;
      }

      return publication;
    },
  });
};

// Create new post
export const createPublicationController = async (req, res) => {
  await execute({
    res,
    success: 201,
    args: req.body,
    callback: async (product) => {
      const { image_url, image_key, ...productData } = product;
      productData.vendor_id = req.user.id;

      const createdProduct = await createPublication(productData);

      if (image_url && image_key) {
        const image = await addProductImage(
          createdProduct.id,
          image_url,
          image_key
        );
        createdProduct.images = [image];
      }

      return createdProduct;
    },
  });
};

//  Update existing post
export const updatePublicationController = async (req, res) => {
  await execute({
    res,
    success: 200,
    args: { ...req.params, ...req.body },
    callback: async ({ id, ...fields }) => {
      const existing = await getPublicationById(id);

      if (!existing) {
        const error = new Error("Publication not found");
        error.status = 404;
        throw error;
      }

      if (existing.vendor_id !== req.user.id) {
        const error = new Error("Unauthorized access");
        error.status = 403;
        throw error;
      }

      return await updatePublication(id, fields);
    },
  });
};

//  Delete post
export const deletePublication = async (req, res) => {
  await execute({
    res,
    success: 200,
    args: req.params,
    callback: async ({ id }) => {
      const existing = await getPublicationById(id);

      if (!existing) {
        throw Object.assign(new Error("Publication not found"), {
          status: 404,
        });
      }

      if (existing.vendor_id !== req.user.id) {
        throw Object.assign(new Error("Unauthorized access"), { status: 403 });
      }

      const result = await deletePublicationById(id);
      return {
        message: "Publication deleted successfully",
        deleted: result.rows[0],
      };
    },
  });
};
  
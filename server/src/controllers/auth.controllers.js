import { registerUser, loginUser } from "../models/auth.models.js"
import execute from "./execute.js"
import executeQuery from "../models/executeQuery.js"

export const register = async (req, res) =>
  execute({
    res,
    success: 201,
    callback: registerUser,
    args: req.body,
  })

export const login = async (req, res) =>
    execute({
      res,
      success: 200,
      callback: loginUser,
      args: req.body,
  })

export const getUserProfile = async (req, res) => {
    const { id } = req.user;
  
    const result = await executeQuery({
      text: `
        SELECT
          id, email, surname, last_name, birthday, avatar_url,
          address_line_1, address_line_2, city, state, country, zip_code,
          notify_shipping, notify_purchase, notify_publication, notify_review, notify_pass_change,
          language
        FROM users
        WHERE id = $1
      `,
      values: [id],
    });
  
    const user = result[0];
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    res.status(200).json({
      user: {
        id: user.id,
        name: `${user.surname} ${user.last_name}`,
        email: user.email,
        birthday: user.birthday,
        avatar_url: user.avatar_url,
        address: {
          line1: user.address_line_1,
          line2: user.address_line_2,
          city: user.city,
          state: user.state,
          zip_code: user.zip_code,
          country: user.country,
        },
        preferences: {
          language: user.language,
          notify_shipping: user.notify_shipping,
          notify_purchase: user.notify_purchase,
          notify_publication: user.notify_publication,
          notify_review: user.notify_review,
          notify_pass_change: user.notify_pass_change,
        }
      }
    });
};

export const updateUserProfile = async (req, res) => {
  const { id } = req.user;
  const {
    surname,
    last_name,
    birthday,
    avatar_url,
    address_line_1,
    address_line_2,
    city,
    state,
    country,
    zip_code,
    language,
    notify_shipping,
    notify_purchase,
    notify_publication,
    notify_review,
    notify_pass_change
  } = req.body;

  await executeQuery({
    text: `
      UPDATE users SET
        surname = $1,
        last_name = $2,
        birthday = $3,
        avatar_url = $4,
        address_line_1 = $5,
        address_line_2 = $6,
        city = $7,
        state = $8,
        country = $9,
        zip_code = $10,
        language = $11,
        notify_shipping = $12,
        notify_purchase = $13,
        notify_publication = $14,
        notify_review = $15,
        notify_pass_change = $16
      WHERE id = $17
    `,
    values: [
      surname,
      last_name,
      birthday,
      avatar_url,
      address_line_1,
      address_line_2,
      city,
      state,
      country,
      zip_code,
      language,
      notify_shipping,
      notify_purchase,
      notify_publication,
      notify_review,
      notify_pass_change,
      id
    ]
  });

  res.status(200).json({ message: "User profile updated successfully" });
};

  
    
    
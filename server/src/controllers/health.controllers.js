import execute from "./execute.js"

export const checkHealth = (req, res) =>
  execute({
    res,
    success: 200,
    callback: () => "OK",
    args: req.params,
  })

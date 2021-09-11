import db from "db"
import {RitzApiRequest, RitzApiResponse} from "ritz"

export default async function users(_req: RitzApiRequest, res: RitzApiResponse) {
  const products = await db.product.findMany()
  res.status(200).send(products)
}

import {Form, Field} from "react-final-form"
import {Product, Prisma} from "db"
import createProduct from "../mutations/createProduct"
import updateProduct from "../mutations/updateProduct"
import {useMutation} from "ritz"
// integration test for css modules
import styles from "./ProductForm.module.scss"

type ProductInput = Prisma.ProductCreateInput | Product

function isNew(product: ProductInput): product is Prisma.ProductCreateInput {
  return (product as any).id === undefined
}

type ProductFormProps = {
  product?: Prisma.ProductUpdateInput
  style?: React.CSSProperties
  onSuccess: (product: Product) => any
}

function ProductForm({product, style, onSuccess, ...props}: ProductFormProps) {
  const [createProductMutation] = useMutation(createProduct)
  const [updateProductMutation] = useMutation(updateProduct)
  return (
    <Form
      initialValues={product || {name: null, handle: null, description: null, price: null}}
      onSubmit={async (data: any) => {
        if (isNew(data)) {
          try {
            const product = await createProductMutation({data})
            onSuccess(product)
          } catch (error) {
            alert("Error creating product " + JSON.stringify(error, null, 2))
          }
        } else {
          try {
            // Can't update id
            const id = data.id
            delete data.id
            const product = await updateProductMutation({where: {id}, data})
            onSuccess(product)
          } catch (error) {
            alert("Error updating product " + JSON.stringify(error, null, 2))
          }
        }
      }}
      render={({handleSubmit}) => (
        <form
          onSubmit={handleSubmit}
          style={{maxWidth: 400, ...style}}
          className={styles.red}
          {...props}
        >
          <div style={{marginBottom: 16}}>
            <label style={{display: "flex", flexDirection: "column"}}>
              Product Name
              <Field name="name" component="input" />
            </label>
          </div>

          <div style={{marginBottom: 16}}>
            <label style={{display: "flex", flexDirection: "column"}}>
              Handle
              <Field name="handle" component="input" />
            </label>
          </div>

          <div style={{marginBottom: 16}}>
            <label style={{display: "flex", flexDirection: "column"}}>
              Description
              <Field name="description" component="textarea" />
            </label>
          </div>

          <div style={{marginBottom: 16}}>
            <label style={{display: "flex", flexDirection: "column"}}>
              Price
              <Field
                name="price"
                component="input"
                parse={(value) => (value ? parseInt(value) : null)}
              />
            </label>
          </div>

          <button>{product ? "Update" : "Create"} Product</button>
        </form>
      )}
    />
  )
}

export default ProductForm

require("dotenv").config()

const express = require("express")
const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.json())

const paypal = require("@paypal/checkout-server-sdk")
const Environment = paypal.core.SandboxEnvironment
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
)

const storeItems = new Map([
  [1, { price: 100, name: "Learn React Today" }],
  [2, { price: 200, name: "Learn CSS Today" }],
])

app.get("/", (req, res) => {
  res.render("index", {
    paypalClientId: process.env.PAYPAL_CLIENT_ID,
  })
})

app.post("/create-order", async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest()
 // const total = req.body.items.reduce((sum, item) => {
  //  return sum + storeItems.get(item.id).price * item.quantity
 // }, 0)
  request.prefer("return=representation")
  request.requestBody({
   "intent": "CAPTURE",
    "purchase_units": [
    {
      "amount": {
        "currency_code": "USD",
        "value": "100.00"
      }
    }
  ],
  })

  try {
    const order = await paypalClient.execute(request)
    console.log("request " +request) 
    res.json({ id: order.result.id })
    console.log("order id " + order.result.id) 
  } catch (e) {
    res.status(500).json({ error: e.message })
    console.log("error " +e.message) 
  }
})

//app.listen(3000)
var server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});



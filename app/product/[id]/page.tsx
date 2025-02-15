import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// This is a mock product. In a real application, you would fetch this data from an API.
const product = {
  id: 1,
  name: "Wireless Earbuds",
  price: 79.99,
  description: "High-quality wireless earbuds with noise cancellation and long battery life.",
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  specifications: [
    { name: "Battery Life", value: "Up to 8 hours" },
    { name: "Connectivity", value: "Bluetooth 5.0" },
    { name: "Water Resistance", value: "IPX4" },
  ],
  relatedItems: [
    { id: 2, name: "Smart Watch", price: 199.99, image: "/placeholder.svg" },
    { id: 3, name: "Bluetooth Speaker", price: 59.99, image: "/placeholder.svg" },
  ],
}

export default function ProductDetails() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={600}
              height={400}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.slice(1).map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`${product.name} - Image ${index + 2}`}
                width={200}
                height={150}
                className="w-full h-auto
rounded-lg"
              />
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <Button size="lg" className="w-full mb-6">Add to Cart</Button>
          <h2 className="text-xl font-semibold mb-4">Specifications</h2>
          <ul className="list-disc pl-6 mb-6">
            {product.specifications.map((spec, index) => (
              <li key={index} className="mb-2">
                <span className="font-semibold">{spec.name}:</span> {spec.value}
              </li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold mb-4">Related Items</h2>
          <div className="grid grid-cols-2 gap-4">
            {product.relatedItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={150}
                    height={100}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


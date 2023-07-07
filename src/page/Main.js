import "../style/Main.css"
import safety from "../img/safety.png";
import worker from "../img/worker2.png";
import mark from "../img/x-mark.png"
import logo from "../img/logo.png"

function Main() {

  const products = [
    {
      id: 1,
      name: '안전교육',
      href: '#',
      imageSrc: safety,
      imageAlt: '안전교육',
    },
    {
      id: 2,
      name: '안전점검',
      href: '#',
      imageSrc: worker,
      imageAlt: '안전점검',
    },
    {
      id: 3,
      name: '임시',
      href: '#',
      imageSrc: mark,
      imageAlt: '임시',
    },
    {
      id: 4,
      name: '임시',
      href: '#',
      imageSrc: mark,
      imageAlt: '임시',
    },
    
    // More products...
  ]


  return (
      <div id="wrap2">
        <div className="bg-white mt-8" >
        <img src={logo} className="mx-auto w-96" />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <a key={product.id} href={product.href} className="group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg xl:aspect-h-8 xl:aspect-w-7 shadow">
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className="h-full w-full m-0 object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              
            </a>
          ))}
        </div>
      </div>
    </div>

      </div>
  )
}

export default Main;

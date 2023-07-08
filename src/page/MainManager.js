import "../style/Main.css"
import safety from "../img/safety.png";
import worker from "../img/worker2.png";
import mark from "../img/x-mark.png"
import logo from "../img/logo.png"
// import bannerImage from "../img/main_movie_bg.jpg"
import info from "../img/personal-profile.png"

function MainManager() {

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
      name: '기준정보등록',
      href: '#',
      imageSrc: info,
      imageAlt: '기준정보',
    },
    {
      id: 4,
      name: '준비중',
      href: '#',
      imageSrc: mark,
      imageAlt: '임시',
    },
    
    // More products...
  ]
  



  return (
    <div id="wrap2">
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
      <div className="logoeara mt-4">
      <img src={logo} className="w-80 " />
      <p className=" text-seahColor text-lg ">안전도 <b>SeAH</b>답게!</p> 
      </div>
      
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          <div className="col-span-full">
            <div className="banner">
              <div className="bannerText">
              <p className="text1">고객과 함께 성장하는 메탈 산업의 Hidden Champion</p>
              <p className="text2">㈜세아항공방산소재는 전세계 시장을 위한 방위 산업, 한공우주 및 산업용으로 사용되는 고력합금 알루미늄을 생산합니다</p>
              </div>
            </div>
          </div>
          {products.map((product, index) => (
            <a key={product.id} href={product.href} className="group">
              <div className={`aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg xl:aspect-h-8 xl:aspect-w-7 shadow ${index % 2 === 0 ? 'col-span-2' : 'col-span-1'}`}>
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className="h-full w-full m-0 object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h2 className="mt-4 text-xl text-gray-700 text-center font-semibold">{product.name}</h2>
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
  
  )
}

export default MainManager;
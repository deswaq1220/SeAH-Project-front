
import { Link } from "react-router-dom"

export default function Footer() {
    return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
      
        <div className="mt-8 border-t border-gray-900/10 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <Link to="/license">
              <h3 className="text-sm  leading-6 text-gray-400">오픈소스 라이선스</h3>
            </Link>
            
          </div>
           
          {/* <p className="mt-8 text-xs leading-5 text-gray-500 md:order-1 md:mt-0">
            &copy; 2020 Your Company, Inc. All rights reserved.
          </p> */}
        </div>
      </div>
    </footer>
  )
}

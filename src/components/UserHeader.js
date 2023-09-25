import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import logo from "../img/logo.png";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/404" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img className="h-8 w-auto" src={logo} alt="" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-slate-100 "
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            {/*<Bars3Icon className="h-6 w-6" aria-hidden="true" />*/}
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">

        </div>
      </nav>
      {/*<Dialog*/}
      {/*  as="div"*/}
      {/*  className="lg:hidden"*/}
      {/*  open={mobileMenuOpen}*/}
      {/*  onClose={setMobileMenuOpen}*/}
      {/*>*/}
      {/*  <div className="fixed inset-0 z-10" />*/}
      {/*  <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">*/}
      {/*    <div className="flex items-center justify-between">*/}
      {/*      <a href="#" className="-m-1.5 p-1.5">*/}
      {/*        <span className="sr-only">Your Company</span>*/}
      {/*        <img className="h-8 w-auto" src={logo} alt="" />*/}
      {/*      </a>*/}
      {/*      <button*/}
      {/*        type="button"*/}
      {/*        className="-m-2.5 rounded-md p-2.5 text-gray-700"*/}
      {/*        onClick={() => setMobileMenuOpen(false)}*/}
      {/*      >*/}
      {/*        <span className="sr-only">Close menu</span>*/}
      {/*        <XMarkIcon className="h-6 w-6" aria-hidden="true" />*/}
      {/*      </button>*/}
      {/*    </div>*/}
      {/*    <div className="mt-6 flow-root">*/}
      {/*      <div className="-my-6 divide-y divide-gray-500/10">*/}
      {/*        <div className="space-y-2 py-6">*/}

      {/*        </div>*/}
      {/*        <div className="py-6">*/}

      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </Dialog.Panel>*/}
      {/*</Dialog>*/}
    </header>
  );
}

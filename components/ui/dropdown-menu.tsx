// components/DropdownMenu.tsx
import { Menu, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';

// Typen für die Props der Dropdown-Komponenten definieren
interface DropdownMenuProps {
  children: ReactNode;
}

interface DropdownMenuItemProps {
  children: ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {children}
    </Menu>
  );
}

export function DropdownMenuTrigger({ children }: DropdownMenuProps) {
  return (
    <Menu.Button>
      {children}
    </Menu.Button>
  );
}

export function DropdownMenuContent({ children }: DropdownMenuProps) {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">{children}</div>
      </Menu.Items>
    </Transition>
  );
}

export function DropdownMenuItem({ children }: DropdownMenuItemProps) {
  return (
    <Menu.Item>
      {({ active }) => (
        <a
          className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
        >
          {children}
        </a>
      )}
    </Menu.Item>
  );
}

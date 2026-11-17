import { useState } from 'react'
import { foodMenu, drinksMenu, formatPrice } from '../data/menu.js'

export default function FullMenu() {
  const [tab, setTab] = useState('food')
  const groups = tab === 'food' ? foodMenu : drinksMenu
  return (
    <>
      <div className="menu-tabs" role="tablist">
        {[['food', 'Food'], ['drinks', 'Drinks']].map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={`menu-tab ${tab === key ? 'active' : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="full-menu">
        {groups.map((group) => (
          <div className="full-menu-col" key={group.cat}>
            <div className="cat">{group.cat}</div>
            {group.items.map(([name, price]) => (
              <div className="menu-line" key={name}>
                <span className="name">{name}</span>
                <span className="leader" />
                <span className="price">{formatPrice(price)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

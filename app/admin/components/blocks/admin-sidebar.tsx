// import "./admin-sidebar.scss"
import { SVG } from '@/components/svg';

export default function AdminSidebar(props){
  const { sidebarMenu } = props;
  //console.log('sidebarMenu:',sidebarMenu);
  return (   
    <aside id="sidebar" className="relative flex flex-col flex-wrap border-r border-gray-300 p-6 flex-none w-64 animated faster">
      <nav>
        {sidebarMenu.map((group, index) => (
          <div className="group" key={index}>
            <h3 className="title">{group.title.toUpperCase()}</h3>
            <ul className="menu">
              {group.listItems.map((li, innerIndex) => (
                <li key={`${index}_${innerIndex}`}><a className="menu-item" href={li.url}>
                  <SVG icon={li.icon} />
                  <span>{li.title}</span>
                </a></li>
              ))}
            </ul>
          </div>
        ))}
      </nav>   
    </aside>
  )
}

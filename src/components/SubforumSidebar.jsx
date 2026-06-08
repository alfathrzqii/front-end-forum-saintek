import { Link } from 'react-router-dom';

export default function SubforumSidebar({ subforums }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden transition-colors duration-200">
      <div className="bg-blue-600 p-4">
        <h2 className="text-white font-bold">Popular Subforums</h2>
      </div>
      <div className="p-2">
        {subforums.length > 0 ? (
          <ul className="flex overflow-x-auto lg:flex-col lg:overflow-visible divide-x lg:divide-x-0 lg:divide-y divide-gray-100 dark:divide-gray-700 scrollbar-hide pb-2 lg:pb-0">
            {subforums.map((subforum) => (
              <li key={subforum.id} className="flex-shrink-0 lg:flex-shrink">
                <Link
                  to={`/subforums/${subforum.slug}`}
                  className="flex items-center px-4 py-3 lg:p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 whitespace-nowrap"
                >
                  <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">s/{subforum.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm p-4 italic text-center">No subforums found.</p>
        )}
      </div>
    </div>
  );
}

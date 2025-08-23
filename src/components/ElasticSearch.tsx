import { useRef, useState } from 'react';

interface ElasticSearchItem {
  id?: number;
  displayText: string;
  name?: string,
  surname?: string,
  initials?: string,
  color?: string,
  role?: string,
  status?: string,
  completedAt?: string,
  subject?: string,
  confirm?: string,
  nameMentor?: string | null
}

interface ElasticSearchProps<T extends ElasticSearchItem> {
  items: T[];
  backgroundcolor: string;
  placeholder?: string;
  renderItem?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  defaultVisible?: boolean;
  onItemClick?: (item: T) => void;

  isMultiSelect?: boolean; 
  selectedItems?: string[];
  keepListVisible?: boolean;
  disableInputCapture?: boolean;
}

export default function ElasticSearch<T extends ElasticSearchItem>({
  items,
  backgroundcolor,
  placeholder = 'Введите имя куратора...',
  renderItem,
  emptyMessage = 'Ничего не найдено',
  defaultVisible = true,
  onItemClick,

  isMultiSelect = false,
  selectedItems = [],
  keepListVisible = false,
  disableInputCapture = false,
}: ElasticSearchProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isListVisible, setIsListVisible] = useState(defaultVisible);

  const filteredItems = items.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.trim().toLowerCase();
    return item.displayText.toLowerCase().includes(term);
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isListVisible) setIsListVisible(true);
  };

  const handleFocus = () => {
    setIsListVisible(true);
  };

  const handleItemClick = (item: T) => {
    if (onItemClick) {
      onItemClick(item);
      if (!keepListVisible) {
        setIsListVisible(false);
      }
      if (!disableInputCapture) {
        setSearchTerm(item.displayText);
      }
    }
  };

    return (
    <div className={`elastic-search`}>
      <div className="search-input-wrapper">
        <img 
          src="/images/search.svg" 
          alt="Лупа"
          className="search-icon"
        />
        <input
          ref={inputRef}
          className="elastic-search-input"
          style={{ backgroundColor: backgroundcolor }}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
      </div>
      {isListVisible && (
        <ul className={`elastic-search-list`}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.id || item.displayText}
                className={`elastic-search-item`}
                style={{
                  display: searchTerm && !filteredItems.includes(item) ? 'none' : 'flex',
                  flexDirection: 'row',
                  cursor: onItemClick ? 'pointer' : 'default'
                }}
                onClick={() => onItemClick && handleItemClick(item)}
              >
                {isMultiSelect && (
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id || item.displayText)}
                    readOnly
                    style={{ marginRight: '10px',  marginLeft: '20px'}}
                  />
                )}
                  <div style={{ flex: 1 }}>
                    {renderItem ? renderItem(item) : item.displayText}
                  </div>
              </li>
            ))
          ) : (
            <li className="elastic-search-empty">{emptyMessage}</li>
          )}
        </ul>
      )}
    </div>
  );
}
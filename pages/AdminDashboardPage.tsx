import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { WebsiteData, Book } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';

type AdminSection = 'home' | 'about' | 'books' | 'settings';

// Helper for file input to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const AdminDashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data, setData, loading } = useData();
  const [activeSection, setActiveSection] = useState<AdminSection>('home');

  const homeUrl = window.location.href.split('#')[0] + '#/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const updateData = (updateFn: (draft: WebsiteData) => void) => {
    if (!data) return;
    // Create a deep copy to ensure immutability
    const newData = JSON.parse(JSON.stringify(data));
    updateFn(newData);
    setData(newData);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, ...path: string[]) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const finalValue = type === 'number' ? parseFloat(value) : value;

    updateData(draft => {
      let current = draft as any;
      path.forEach(key => {
        current = current[key];
      });
      current[name] = finalValue;
    });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>, ...path: string[]) => {
    const { name, checked } = e.target;
    updateData(draft => {
      let current = draft as any;
      path.forEach(key => {
        current = current[key];
      });
      current[name] = checked;
    });
  }

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>, ...path: string[]) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      updateData(draft => {
        let current = draft as any;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }
        current[path[path.length - 1]] = base64;
      });
    }
  };

  if (loading || !data) return <div className="p-4">Loading dashboard...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <nav className="flex flex-col space-y-2">
          {(['home', 'about', 'books', 'settings'] as AdminSection[]).map(section => (
            <button key={section} onClick={() => setActiveSection(section)} className={`text-left p-2 rounded capitalize ${activeSection === section ? 'bg-blue-500' : 'hover:bg-gray-700'}`}>
              {section}
            </button>
          ))}
        </nav>
        
        <div className="mt-8 border-t border-gray-700 pt-4">
          <a href={homeUrl} target="_blank" rel="noopener noreferrer" className="block text-center p-2 rounded hover:bg-gray-700 transition-colors">
            View Website
          </a>
        </div>

        <div className="mt-auto">
          <p className="text-xs text-gray-400 mb-2 text-center">Changes are saved automatically.</p>
          <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Home Page Controls */}
        {activeSection === 'home' && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Home Page Content</h2>
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <Input label="Hero Text" name="heroText" value={data.home.heroText} onChange={e => handleInputChange(e, 'home')} />
              <Input label="Tagline" name="tagline" value={data.home.tagline} onChange={e => handleInputChange(e, 'home')} />
              <Textarea label="Support a New Writer Content" name="supportWriterText" value={data.home.supportWriterText} onChange={e => handleInputChange(e, 'home')} />
              <Input label="Button Text" name="buttonText" value={data.home.buttonText} onChange={e => handleInputChange(e, 'home')} />
              <Input label="Button Link" name="buttonLink" value={data.home.buttonLink} onChange={e => handleInputChange(e, 'home')} />
            </div>
          </section>
        )}

        {/* About Page Controls */}
        {activeSection === 'about' && (
           <section>
            <h2 className="text-2xl font-bold mb-4">About Page Content</h2>
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <Textarea label="Author Bio" name="bio" value={data.about.bio} onChange={e => handleInputChange(e, 'about')} />
              <Textarea label="Purpose Text" name="purposeText" value={data.about.purposeText} onChange={e => handleInputChange(e, 'about')} />
               <div>
                  <label className="block text-gray-700 mb-1">Author Image</label>
                  <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'about', 'imageUrl')} className="w-full p-2 border rounded" />
                  {data.about.imageUrl && <img src={data.about.imageUrl} alt="Author Preview" className="mt-2 h-32 rounded" />}
               </div>
            </div>
          </section>
        )}

        {/* Books Management */}
        {activeSection === 'books' && <BooksManager data={data} setData={setData} />}

        {/* Settings */}
        {activeSection === 'settings' && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Website Settings</h2>
            <div className="space-y-6">
                {/* General Settings */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">General Settings</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input label="Site Logo Text" name="siteLogo" value={data.settings.general.siteLogo} onChange={e => handleInputChange(e, 'settings', 'general')} />
                        <Input label="Nav: Home" name="navHome" value={data.settings.general.navHome} onChange={e => handleInputChange(e, 'settings', 'general')} />
                        <Input label="Nav: About" name="navAbout" value={data.settings.general.navAbout} onChange={e => handleInputChange(e, 'settings', 'general')} />
                        <Input label="Nav: Books" name="navBooks" value={data.settings.general.navBooks} onChange={e => handleInputChange(e, 'settings', 'general')} />
                        <Input label="Footer: Instagram Link" name="footerInstagramLink" value={data.settings.general.footerInstagramLink} onChange={e => handleInputChange(e, 'settings', 'general')} />
                        <Input label="Footer: Copyright" name="footerCopyright" value={data.settings.general.footerCopyright} onChange={e => handleInputChange(e, 'settings', 'general')} />
                    </div>
                </div>
                {/* Theme Settings */}
                <div className="bg-white p-6 rounded-lg shadow">
                   <h3 className="text-xl font-semibold mb-4 border-b pb-2">Color Theme</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                       <Input type="color" label="Beige (Background)" name="beige" value={data.settings.general.theme.beige} onChange={e => handleInputChange(e, 'settings', 'general', 'theme')} />
                       <Input type="color" label="Brown (Primary)" name="brown" value={data.settings.general.theme.brown} onChange={e => handleInputChange(e, 'settings', 'general', 'theme')} />
                       <Input type="color" label="Text" name="text" value={data.settings.general.theme.text} onChange={e => handleInputChange(e, 'settings', 'general', 'theme')} />
                       <Input type="color" label="Accent" name="accent" value={data.settings.general.theme.accent} onChange={e => handleInputChange(e, 'settings', 'general', 'theme')} />
                    </div>
                </div>
                {/* AdSense Settings */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">AdSense Settings</h3>
                    <Textarea label="AdSense Script Code" name="scriptCode" value={data.settings.adsense.scriptCode} onChange={e => handleInputChange(e, 'settings', 'adsense')} />
                    <div className="flex space-x-4 mt-2">
                        <Checkbox label="Enable on Home" name="homeEnabled" checked={data.settings.adsense.homeEnabled} onChange={e => handleCheckboxChange(e, 'settings', 'adsense')} />
                        <Checkbox label="Enable on About" name="aboutEnabled" checked={data.settings.adsense.aboutEnabled} onChange={e => handleCheckboxChange(e, 'settings', 'adsense')} />
                        <Checkbox label="Enable on Books" name="booksEnabled" checked={data.settings.adsense.booksEnabled} onChange={e => handleCheckboxChange(e, 'settings', 'adsense')} />
                    </div>
                </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};


// Form components
const Input: React.FC<{ label: string, name: string, value: string | number, onChange: (e: ChangeEvent<HTMLInputElement>) => void, type?: string }> = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-gray-700 mb-1">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} className="w-full p-2 border rounded" step={type === 'number' ? '0.01' : undefined} />
  </div>
);
const Textarea: React.FC<{ label: string, name: string, value: string, onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }> = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-gray-700 mb-1">{label}</label>
    <textarea name={name} value={value} onChange={onChange} rows={4} className="w-full p-2 border rounded"></textarea>
  </div>
);
const Checkbox: React.FC<{ label: string, name: string, checked: boolean, onChange: (e: ChangeEvent<HTMLInputElement>) => void }> = ({ label, name, checked, onChange }) => (
    <div className="flex items-center">
        <input type="checkbox" id={name} name={name} checked={checked} onChange={onChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
        <label htmlFor={name} className="ml-2 block text-sm text-gray-900">{label}</label>
    </div>
);


// Books Manager Component
const emptyBook: Book = { id: '', title: '', description: '', price: 0, coverImage: '', purchaseLinks: { amazon: '', gumroad: '', etsy: '' }};

const BooksManager: React.FC<{data: WebsiteData, setData: (data: WebsiteData) => void}> = ({ data, setData }) => {
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

    const handleEdit = (book: Book) => setEditingBook({...book});
    const handleAddNew = () => setEditingBook({...emptyBook, id: `new-book-${Date.now()}`});
    const handleCancel = () => setEditingBook(null);

    const handleDeleteClick = (book: Book) => {
        setBookToDelete(book);
    };

    const confirmDelete = () => {
        if (!bookToDelete) return;
        const bookId = bookToDelete.id;
        
        const newData = JSON.parse(JSON.stringify(data));
        newData.books = newData.books.filter((book: Book) => book.id !== bookId);
        
        setData(newData);
        setBookToDelete(null);
    };

    const handleSaveBook = (bookToSave: Book) => {
        const newData = JSON.parse(JSON.stringify(data));
        const bookIndex = newData.books.findIndex((b: Book) => b.id === bookToSave.id);

        if (bookIndex > -1) {
            // Update existing book
            newData.books[bookIndex] = bookToSave;
        } else {
            // Add new book
            newData.books.push(bookToSave);
        }
        
        setData(newData);
        setEditingBook(null);
    };

    if (editingBook) {
        return <BookForm book={editingBook} onSave={handleSaveBook} onCancel={handleCancel} />;
    }

    return (
        <>
            <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Books Management</h2>
                  <button onClick={handleAddNew} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add New Book</button>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow">
                  <ul className="divide-y divide-gray-200">
                  {data.books.length > 0 ? (
                    data.books.map(book => (
                      <li key={book.id} className="flex items-center justify-between p-3">
                        <p className="font-medium text-gray-900">{book.title}</p>
                        <div>
                          <button onClick={() => handleEdit(book)} className="text-blue-600 hover:text-blue-800 font-semibold mr-4">Edit</button>
                          <button onClick={() => handleDeleteClick(book)} className="text-red-600 hover:text-red-800 font-semibold">Delete</button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">No books have been added yet.</p>
                  )}
                  </ul>
                </div>
            </section>
            
            {bookToDelete && (
                <ConfirmationModal
                    isOpen={!!bookToDelete}
                    onClose={() => setBookToDelete(null)}
                    onConfirm={confirmDelete}
                    title="Confirm Deletion"
                    message={`Are you sure you want to delete "${bookToDelete.title}"? This action cannot be undone.`}
                />
            )}
        </>
    );
};

const BookForm: React.FC<{book: Book, onSave: (book: Book) => void, onCancel: () => void}> = ({ book, onSave, onCancel }) => {
    const [formState, setFormState] = useState(book);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormState(prev => ({...prev, [name]: type === 'number' ? parseFloat(value) : value}));
    };
    
    const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({...prev, purchaseLinks: {...prev.purchaseLinks, [name]: value }}));
    };

    const handleCoverImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setFormState(prev => ({ ...prev, coverImage: base64 }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">{formState.id.startsWith('new') ? 'Add New Book' : 'Edit Book'}</h3>
            <Input label="Title" name="title" value={formState.title} onChange={handleChange} />
            <Textarea label="Description" name="description" value={formState.description} onChange={handleChange} />
            <Input label="Price" name="price" type="number" value={formState.price} onChange={handleChange} />
            <div>
                <label className="block text-gray-700 mb-1">Cover Image</label>
                <input type="file" accept="image/*" onChange={handleCoverImageChange} className="w-full p-2 border rounded" />
                {formState.coverImage && <img src={formState.coverImage} alt="Cover Preview" className="mt-2 h-48 rounded" />}
            </div>
            <h4 className="font-semibold pt-2">Purchase Links</h4>
            <Input label="Amazon" name="amazon" value={formState.purchaseLinks.amazon} onChange={handleLinkChange} />
            <Input label="Gumroad" name="gumroad" value={formState.purchaseLinks.gumroad} onChange={handleLinkChange} />
            <Input label="Etsy" name="etsy" value={formState.purchaseLinks.etsy} onChange={handleLinkChange} />

            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save Book</button>
            </div>
        </form>
    );
};

export default AdminDashboardPage;
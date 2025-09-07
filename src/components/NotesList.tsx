"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Heart, 
  Eye, 
  EyeOff, 
  Edit, 
  Share2, 
  Trash2, 
  MoreVertical, 
  Search,
  X,
  Tag,
  User,
  Calendar
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Note, NOTE_CATEGORIES } from "@/types/note";
import { formatDistanceToNow } from "date-fns";

interface NotesListProps {
  notes: Note[];
  loading: boolean;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onToggleFavorite: (noteId: string) => void;
  onShare: (note: Note) => void;
  onView: (note: Note) => void;
}

export function NotesList({ 
  notes, 
  loading, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onShare,
  onView 
}: NotesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F or Cmd+F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Escape to clear search
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
      // Ctrl+Shift+F to toggle favorite filter
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setFavoriteFilter(!favoriteFilter);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [favoriteFilter]);

  // Enhanced filtering with better search
  const filteredNotes = notes.filter(note => {
    // Improved search - more comprehensive
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      note.category.toLowerCase().includes(searchLower) ||
      note.authorName.toLowerCase().includes(searchLower)
    );
    
    const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter;
    const matchesFavorite = !favoriteFilter || note.isFavorite;

    return matchesSearch && matchesCategory && matchesFavorite;
  }).sort((a, b) => {
    // Enhanced sorting
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'created':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'updated':
      default:
        return b.updatedAt.getTime() - a.updatedAt.getTime();
    }
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setFavoriteFilter(false);
    setSortBy('updated');
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== '' || categoryFilter !== 'all' || favoriteFilter;

  // Function to highlight search terms
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-800 px-1 rounded">$1</mark>');
  };

  // Get preview text for content
  const getContentPreview = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredNotes.length === 0) {
    return (
      <div className="space-y-6">
        {/* Filters - always show */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              {/* Search and Quick Filters Row */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Cari berdasarkan judul, konten, tag, kategori... (Ctrl+F)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap md:flex-nowrap">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua kategori</SelectItem>
                      {NOTE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant={favoriteFilter ? "default" : "outline"}
                    onClick={() => setFavoriteFilter(!favoriteFilter)}
                    size="sm"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${favoriteFilter ? 'fill-current' : ''}`} />
                    Favorit
                  </Button>
                </div>
              </div>
              
              {/* Sort and Clear Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Urutkan:</span>
                  <Select value={sortBy} onValueChange={(value: 'updated' | 'created' | 'title') => setSortBy(value)}>
                    <SelectTrigger className="w-auto min-w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated">Terbaru diubah</SelectItem>
                      <SelectItem value="created">Terbaru dibuat</SelectItem>
                      <SelectItem value="title">Judul A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Reset Filter
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {notes.length === 0 ? 'Belum ada catatan' : 'Tidak ada catatan yang cocok'}
          </h3>
          <p className="text-gray-500 mb-4">
            {notes.length === 0 
              ? 'Mulai buat catatan pertama Anda!' 
              : 'Coba ubah filter atau kata kunci pencarian'
            }
          </p>
          {hasActiveFilters && notes.length > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              Reset semua filter
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Search and Quick Filters Row */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Cari berdasarkan judul, konten, tag, kategori... (Ctrl+F)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua kategori</SelectItem>
                    {NOTE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant={favoriteFilter ? "default" : "outline"}
                  onClick={() => setFavoriteFilter(!favoriteFilter)}
                  size="sm"
                >
                  <Heart className={`w-4 h-4 mr-2 ${favoriteFilter ? 'fill-current' : ''}`} />
                  Favorit
                </Button>
              </div>
            </div>
            
            {/* Sort and Results Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Urutkan:</span>
                  <Select value={sortBy} onValueChange={(value: 'updated' | 'created' | 'title') => setSortBy(value)}>
                    <SelectTrigger className="w-auto min-w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated">Terbaru diubah</SelectItem>
                      <SelectItem value="created">Terbaru dibuat</SelectItem>
                      <SelectItem value="title">Judul A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-sm text-gray-500">
                  {filteredNotes.length} dari {notes.length} catatan
                </span>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Reset Filter
                </Button>
              )}
            </div>
            
            {/* Quick Filters */}
            {notes.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <span className="text-xs text-gray-500 mr-2 py-1">Cepat:</span>
                {['Pemrograman', 'Matematika', 'Fisika'].map((cat) => {
                  const count = notes.filter(n => n.category === cat).length;
                  return count > 0 ? (
                    <Button
                      key={cat}
                      variant={categoryFilter === cat ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                      className="h-6 px-2 text-xs"
                    >
                      {cat} ({count})
                    </Button>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle 
                    className="text-lg line-clamp-2 cursor-pointer hover:text-blue-600"
                    onClick={() => onView(note)}
                    dangerouslySetInnerHTML={{
                      __html: highlightText(note.title, searchQuery)
                    }}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        searchQuery && note.category.toLowerCase().includes(searchQuery.toLowerCase())
                          ? 'bg-yellow-200 text-yellow-800'
                          : ''
                      }`}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightText(note.category, searchQuery)
                        }}
                      />
                    </Badge>
                    {note.isPublic ? (
                      <Badge variant="outline" className="text-xs text-green-600">
                        <Eye className="w-3 h-3 mr-1" />
                        Publik
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-gray-600">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Privat
                      </Badge>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(note)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Lihat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(note)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleFavorite(note.id)}>
                      <Heart className={`w-4 h-4 mr-2 ${note.isFavorite ? 'fill-current' : ''}`} />
                      {note.isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onShare(note)}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Bagikan
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(note.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Content Preview with Search Highlighting */}
              <div className="mb-4">
                <p 
                  className="text-gray-600 text-sm line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(getContentPreview(note.content), searchQuery)
                  }}
                />
              </div>
              
              {/* Tags */}
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {note.tags.slice(0, 3).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className={`text-xs ${
                        searchQuery && tag.toLowerCase().includes(searchQuery.toLowerCase()) 
                          ? 'bg-yellow-100 border-yellow-300' 
                          : ''
                      }`}
                    >
                      <Tag className="w-2 h-2 mr-1" />
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightText(tag, searchQuery)
                        }}
                      />
                    </Badge>
                  ))}
                  {note.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{note.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {note.authorName}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

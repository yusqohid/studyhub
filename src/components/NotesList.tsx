"use client";

import { useState } from "react";
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
  Search, 
  Filter, 
  Heart, 
  Eye, 
  EyeOff, 
  Calendar, 
  User,
  Tag,
  MoreVertical,
  Edit,
  Trash2,
  Share2
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
  const [categoryFilter, setCategoryFilter] = useState('');
  const [favoriteFilter, setFavoriteFilter] = useState(false);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !categoryFilter || note.category === categoryFilter;
    const matchesFavorite = !favoriteFilter || note.isFavorite;

    return matchesSearch && matchesCategory && matchesFavorite;
  });

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
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Search className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          {notes.length === 0 ? 'Belum ada catatan' : 'Tidak ada catatan yang cocok'}
        </h3>
        <p className="text-gray-500">
          {notes.length === 0 
            ? 'Mulai buat catatan pertama Anda!' 
            : 'Coba ubah filter atau kata kunci pencarian'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari catatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Semua kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua kategori</SelectItem>
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
              className="w-full md:w-auto"
            >
              <Heart className={`w-4 h-4 mr-2 ${favoriteFilter ? 'fill-current' : ''}`} />
              Favorit
            </Button>
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
                  >
                    {note.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {note.category}
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
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {note.content}
              </p>
              
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {note.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="w-2 h-2 mr-1" />
                      {tag}
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

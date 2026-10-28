import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PostCard } from '@/components/post-card';
import { PostComposer } from '@/components/post-composer';
import { StateView } from '@/components/state-view';
import { Text } from '@/components/ui/text';
import { CURRENT_USER, MOCK_POSTS } from '@/data/mock-community';
import {
  FILTERS,
  type ListStatus,
  type PostComment,
  type PostFilter,
  type PostTag,
  type PostView,
} from '@/types/community';

const NO_POSTS: PostView[] = [];

function ChipSeparator() {
  return <View className="w-2" />;
}

function PostSeparator() {
  return <View className="h-4" />;
}

// TODO Fase 6: toggleLike(postId, uid, liked)
function toggleLikeStub(postId: string, liked: boolean): Promise<void> {
  return Promise.resolve();
}

// TODO Fase 6: addComment(...)
function addCommentStub(postId: string, text: string): Promise<void> {
  return Promise.resolve();
}

// TODO Fase 6: createPost(...)
function createPostStub(text: string, tag: PostTag): Promise<void> {
  return Promise.resolve();
}

// TODO Fase 6: useToast().show(...)
function showToastStub(text: string): void {}

type FilterChipProps = {
  label: PostFilter;
  selected: boolean;
  onSelect: (label: PostFilter) => void;
};

function FilterChip({ label, selected, onSelect }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label === 'Todo' ? 'Todo' : `Etiqueta ${label}`}
      onPress={() => onSelect(label)}
      className={`h-11 items-center justify-center rounded-control px-4 ${
        selected ? 'bg-udec-primary' : 'bg-udec-surface active:bg-udec-border'
      }`}
    >
      <Text weight="semibold" className={`text-sm ${selected ? 'text-white' : 'text-udec-muted'}`}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<PostView>>(null);
  const [posts, setPosts] = useState<PostView[]>(MOCK_POSTS);
  const [filter, setFilter] = useState<PostFilter>('Todo');
  const [status, setStatus] = useState<ListStatus>('ready');
  const pendingLikes = useRef<Set<string>>(new Set());
  // Copia del último estado para decidir el siguiente me gusta sin recrear handleToggleLike (y sin romper React.memo).
  const postsRef = useRef(posts);
  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  const firstName = CURRENT_USER.name.split(' ')[0];
  const visiblePosts = filter === 'Todo' ? posts : posts.filter((post) => post.tag === filter);
  const listData = status === 'ready' ? visiblePosts : NO_POSTS;

  const handleToggleLike = useCallback((postId: string) => {
    if (pendingLikes.current.has(postId)) return;
    const current = postsRef.current.find((post) => post.id === postId);
    if (!current) return;
    const nextLiked = !current.likedByMe;
    pendingLikes.current.add(postId);

    setPosts((list) =>
      list.map((post) =>
        post.id === postId
          ? {
              ...post,
              likedByMe: nextLiked,
              likeCount: nextLiked ? post.likeCount + 1 : Math.max(0, post.likeCount - 1),
            }
          : post,
      ),
    );

    toggleLikeStub(postId, nextLiked)
      .catch(() => {
        // Revierte la acción optimista (inversa exacta).
        setPosts((list) =>
          list.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likedByMe: !nextLiked,
                  likeCount: nextLiked ? Math.max(0, post.likeCount - 1) : post.likeCount + 1,
                }
              : post,
          ),
        );
      })
      .finally(() => {
        pendingLikes.current.delete(postId);
      });
  }, []);

  const handleAddComment = useCallback((postId: string, text: string) => {
    const comment: PostComment = {
      id: `local-${Date.now()}`,
      authorId: CURRENT_USER.id,
      authorName: CURRENT_USER.name,
      text,
      createdAt: new Date(),
    };
    setPosts((list) =>
      list.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment], commentCount: post.commentCount + 1 }
          : post,
      ),
    );
    addCommentStub(postId, text);
  }, []);

  const handlePublish = useCallback((text: string, tag: PostTag) => {
    const post: PostView = {
      id: `local-${Date.now()}`,
      authorId: CURRENT_USER.id,
      authorName: CURRENT_USER.name,
      initials: CURRENT_USER.initials,
      color: 'green',
      official: false,
      tag,
      text,
      banner: null,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date(),
      likedByMe: false,
      comments: [],
    };
    setPosts((list) => [post, ...list]);
    setFilter('Todo');
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
    createPostStub(text, tag);
    showToastStub('Publicado en la comunidad');
  }, []);

  const emptyView =
    status === 'loading' ? (
      <View className="min-h-[320px] justify-center">
        <StateView variant="loading" title="Cargando…" rows={3} />
      </View>
    ) : status === 'error' ? (
      <View className="min-h-[320px] justify-center">
        <StateView
          variant="error"
          title="No pudimos cargar las publicaciones"
          message="Revisa tu conexión e intenta de nuevo."
          actionLabel="Reintentar"
          onAction={() => setStatus('ready')}
        />
      </View>
    ) : (
      <View className="min-h-[320px] justify-center">
        <StateView
          variant="empty"
          title={filter === 'Todo' ? 'Todavía no hay publicaciones' : 'No hay publicaciones con esta etiqueta todavía.'}
        />
      </View>
    );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-udec-surface"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 w-full bg-udec-surface">
        <View className="overflow-hidden bg-udec-primary" style={{ paddingTop: insets.top }}>
          <View
            pointerEvents="none"
            importantForAccessibility="no-hide-descendants"
            className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/10"
          />
          <View
            pointerEvents="none"
            importantForAccessibility="no-hide-descendants"
            className="absolute -right-4 -top-4 h-24 w-24 rounded-full border border-white/10"
          />
          <View className="px-4 pb-4 pt-4">
            <Text weight="bold" accessibilityRole="header" className="text-xl tracking-tight text-white">
              Comunidad UdeC
            </Text>
            <Text weight="medium" className="mt-1 text-sm text-white">
              Lo que pasa en tu universidad
            </Text>
          </View>
        </View>

        <View className="border-b border-udec-border bg-udec-background">
          <FlatList
            horizontal
            style={{ flexGrow: 0 }}
            data={FILTERS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <FilterChip label={item} selected={filter === item} onSelect={setFilter} />
            )}
            ItemSeparatorComponent={ChipSeparator}
            contentContainerClassName="px-4 py-3"
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        <FlatList
          ref={listRef}
          className="flex-1"
          data={listData}
          extraData={filter}
          keyExtractor={(post) => post.id}
          renderItem={({ item }) => (
            <PostCard post={item} onToggleLike={handleToggleLike} onAddComment={handleAddComment} />
          )}
          ListHeaderComponent={<PostComposer firstName={firstName} onPublish={handlePublish} />}
          ListEmptyComponent={emptyView}
          ItemSeparatorComponent={PostSeparator}
          contentContainerClassName="px-4 pb-6 pt-4"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

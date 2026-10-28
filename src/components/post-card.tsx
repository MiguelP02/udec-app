import { memo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { colors, fonts, type DataColor } from '@/theme';
import type { EventBannerData, PostView } from '@/types/community';
import { formatRelative } from '@/utils/time';
import { initialsFor } from '@/utils/initials';

export type PostCardProps = {
  post: PostView;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
};

// Clases completas (NativeWind no detecta clases armadas con plantillas). Sirve para avatares y banners.
const COLOR_BG: Record<DataColor, string> = {
  blue: 'bg-udec-primary',
  green: 'bg-udec-secondary',
  yellow: 'bg-udec-accent',
  purple: 'bg-udec-purple',
  rust: 'bg-udec-rust',
  red: 'bg-udec-red',
};

function EventBanner({ banner }: { banner: EventBannerData }) {
  const isBlue = banner.color === 'blue';
  return (
    <View
      accessible
      accessibilityLabel={`${banner.title}. ${banner.subtitle}. ${banner.day} ${banner.month}`}
      className={`flex-row items-center gap-3 rounded-control p-3 ${COLOR_BG[banner.color]}`}
    >
      <View className="min-w-0 flex-1">
        <Text weight="bold" numberOfLines={2} className="text-sm text-white">
          {banner.title}
        </Text>
        <Text className={`mt-1 text-xs ${isBlue ? 'text-udec-primary-soft' : 'text-white'}`}>{banner.subtitle}</Text>
      </View>
      <View className="min-w-[56px] items-center justify-center rounded-control bg-udec-accent px-2.5 py-1.5">
        <Text weight="extrabold" className="text-xl leading-6 text-udec-on-accent">
          {banner.day}
        </Text>
        <Text weight="bold" className="text-xs text-udec-on-accent">
          {banner.month}
        </Text>
      </View>
    </View>
  );
}

function PostCardBase({ post, onToggleLike, onAddComment }: PostCardProps) {
  const [expanded, setExpanded] = useState(post.comments.length > 0);
  const [commentText, setCommentText] = useState('');
  const [commentFocused, setCommentFocused] = useState(false);
  const canSend = commentText.trim().length > 0;
  const now = new Date();

  const submitComment = () => {
    if (!canSend) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  const likeLabel = post.likedByMe ? 'Quitar me gusta' : 'Dar me gusta';
  const commentsLabel = `${post.commentCount} ${post.commentCount === 1 ? 'comentario' : 'comentarios'}`;

  return (
    <View className="rounded-card border border-udec-border bg-udec-background p-4">
      <View className="flex-row items-center gap-3">
        <View className={`h-10 w-10 items-center justify-center rounded-full ${COLOR_BG[post.color]}`}>
          <Text weight="bold" className={`text-xs ${post.color === 'yellow' ? 'text-udec-on-accent' : 'text-white'}`}>
            {post.initials}
          </Text>
        </View>
        <View className="min-w-0 flex-1">
          <View className="flex-row items-center gap-1">
            <Text weight="bold" numberOfLines={1} className="shrink text-sm text-udec-text">
              {post.authorName}
            </Text>
            {post.official ? (
              <View accessible accessibilityLabel="Cuenta oficial verificada">
                <MaterialIcons name="verified" size={18} color={colors.primary} />
              </View>
            ) : null}
          </View>
          <Text className="text-xs text-udec-muted">{`${formatRelative(post.createdAt, now)} · ${post.tag}`}</Text>
        </View>
      </View>

      <Text className="mt-3 text-sm leading-5 text-udec-text">{post.text}</Text>

      {post.banner ? (
        <View className="mt-3">
          <EventBanner banner={post.banner} />
        </View>
      ) : null}

      <View className="mt-3 flex-row items-center gap-2 border-t border-udec-border pt-1">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: post.likedByMe }}
          accessibilityLabel={`${likeLabel}. ${post.likeCount} me gusta`}
          onPress={() => onToggleLike(post.id)}
          className="min-h-[44px] min-w-[44px] flex-row items-center gap-1.5 pr-3"
        >
          <MaterialIcons
            name={post.likedByMe ? 'favorite' : 'favorite-border'}
            size={22}
            color={post.likedByMe ? colors.red : colors.muted}
          />
          <Text weight="semibold" className={`text-sm ${post.likedByMe ? 'text-udec-red' : 'text-udec-muted'}`}>
            {post.likeCount}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={commentsLabel}
          accessibilityHint={expanded ? 'Oculta los comentarios' : 'Muestra los comentarios'}
          onPress={() => setExpanded((value) => !value)}
          className="min-h-[44px] min-w-[44px] flex-row items-center gap-1.5 pr-3"
        >
          <MaterialIcons name="chat-bubble-outline" size={22} color={colors.muted} />
          <Text weight="semibold" className="text-sm text-udec-muted">
            {post.commentCount}
          </Text>
        </Pressable>
      </View>

      {expanded ? (
        <View className="mt-1">
          {post.comments.map((comment) => (
            <View key={comment.id} className="flex-row items-start gap-2 py-2">
              <View className="h-7 w-7 items-center justify-center rounded-full bg-udec-primary">
                <Text weight="bold" className="text-xs text-white">
                  {initialsFor(comment.authorName)}
                </Text>
              </View>
              <View className="min-w-0 flex-1">
                <Text weight="bold" className="text-sm text-udec-text">
                  {comment.authorName}
                </Text>
                <Text className="mt-0.5 text-sm leading-5 text-udec-text">{comment.text}</Text>
              </View>
            </View>
          ))}

          <View
            className={`mt-2 min-h-[44px] flex-row items-center rounded-control border pl-3 pr-1 ${
              commentFocused ? 'border-udec-primary bg-udec-background' : 'border-udec-border bg-udec-field'
            }`}
          >
            <TextInput
              accessibilityLabel="Escribe un comentario"
              placeholder="Escribe un comentario"
              placeholderTextColor={colors.muted}
              value={commentText}
              onChangeText={setCommentText}
              onFocus={() => setCommentFocused(true)}
              onBlur={() => setCommentFocused(false)}
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={submitComment}
              className="flex-1 py-2.5 text-sm text-udec-text"
              style={{ fontFamily: fonts.medium }}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Enviar comentario"
              accessibilityState={{ disabled: !canSend }}
              disabled={!canSend}
              onPress={submitComment}
              className="h-11 w-11 items-center justify-center rounded-full active:bg-udec-surface"
            >
              <MaterialIcons name="send" size={20} color={canSend ? colors.primary : colors.muted} />
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

export const PostCard = memo(PostCardBase);

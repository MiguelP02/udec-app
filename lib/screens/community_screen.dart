import 'package:flutter/material.dart';

import '../app_state.dart';
import '../models.dart';
import '../theme.dart';
import '../widgets.dart';

const _tags = ['Eventos', 'Semilleros', 'Deportes', 'Ventas', 'Perdidos'];

class CommunityScreen extends StatefulWidget {
  const CommunityScreen({super.key});

  @override
  State<CommunityScreen> createState() => _CommunityScreenState();
}

class _CommunityScreenState extends State<CommunityScreen> {
  final _postText = TextEditingController();
  String _filter = 'Todo';
  String _newTag = _tags.first;

  @override
  void dispose() {
    _postText.dispose();
    super.dispose();
  }

  void _publish() {
    final text = _postText.text.trim();
    if (text.isEmpty) return;
    AppScope.read(context).addPost(text, _newTag);
    _postText.clear();
    setState(() => _filter = 'Todo');
    showToast(context, 'Publicado en la comunidad');
  }

  @override
  Widget build(BuildContext context) {
    final app = AppScope.of(context);
    final posts = app.posts.where((p) => _filter == 'Todo' || p.tag == _filter).toList();
    final firstName = app.me.split(' ').first;

    return Scaffold(
      appBar: udecAppBar('Comunidad UdeC', 'Lo que pasa en tu universidad'),
      body: ListView(
        children: [
          SizedBox(
            height: 52,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.fromLTRB(16, 10, 16, 4),
              children: [
                for (final t in ['Todo', ..._tags])
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(t == 'Todo' ? t : '#$t'),
                      selected: _filter == t,
                      showCheckmark: false,
                      selectedColor: UdecColors.green,
                      labelStyle: TextStyle(
                        color: _filter == t ? Colors.white : UdecColors.muted,
                        fontWeight: FontWeight.w600,
                      ),
                      onSelected: (_) => setState(() => _filter = t),
                    ),
                  ),
              ],
            ),
          ),
          // Nueva publicación
          Container(
            margin: const EdgeInsets.fromLTRB(16, 10, 16, 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border.all(color: UdecColors.line),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                TextField(
                  controller: _postText,
                  minLines: 2,
                  maxLines: 5,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: '¿Qué quieres compartir con la comunidad, $firstName?',
                    filled: false,
                    border: InputBorder.none,
                    enabledBorder: InputBorder.none,
                    focusedBorder: InputBorder.none,
                  ),
                ),
                Row(
                  children: [
                    Expanded(
                      child: DropdownButton<String>(
                        value: _newTag,
                        isExpanded: true,
                        underline: const SizedBox.shrink(),
                        items: [for (final t in _tags) DropdownMenuItem(value: t, child: Text('#$t'))],
                        onChanged: (v) => setState(() => _newTag = v ?? _newTag),
                      ),
                    ),
                    const SizedBox(width: 8),
                    FilledButton(
                      onPressed: _postText.text.trim().isEmpty ? null : _publish,
                      child: const Text('Publicar'),
                    ),
                  ],
                ),
              ],
            ),
          ),
          if (posts.isEmpty)
            const Padding(
              padding: EdgeInsets.all(40),
              child: Text('No hay publicaciones con esta etiqueta todavía.',
                  textAlign: TextAlign.center, style: TextStyle(color: UdecColors.muted)),
            ),
          for (final p in posts) PostCard(key: ValueKey(p.id), post: p),
        ],
      ),
    );
  }
}

class PostCard extends StatefulWidget {
  final Post post;
  const PostCard({super.key, required this.post});

  @override
  State<PostCard> createState() => _PostCardState();
}

class _PostCardState extends State<PostCard> {
  final _comment = TextEditingController();

  @override
  void dispose() {
    _comment.dispose();
    super.dispose();
  }

  void _sendComment() {
    final t = _comment.text.trim();
    if (t.isEmpty) return;
    AppScope.read(context).addComment(widget.post, t);
    _comment.clear();
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.post;
    final app = AppScope.read(context);
    return Container(
      decoration: const BoxDecoration(border: Border(top: BorderSide(color: UdecColors.surface2, width: 8))),
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              InitialsAvatar(text: p.initials, color: p.color, size: 40),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(p.author,
                              overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w700)),
                        ),
                        if (p.official) ...[
                          const SizedBox(width: 4),
                          const Icon(Icons.verified, size: 16, color: UdecColors.blue),
                        ],
                      ],
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Text('${p.time} · ', style: const TextStyle(fontSize: 12.5, color: UdecColors.muted)),
                        Pill('#${p.tag}',
                            background: p.official ? UdecColors.blueSoft : UdecColors.greenSoft,
                            foreground: p.official ? UdecColors.blue : UdecColors.greenDark),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: Text(p.text, style: const TextStyle(height: 1.45, fontSize: 14.5)),
          ),
          if (p.banner != null) _Banner(p.banner!),
          Row(
            children: [
              TextButton.icon(
                onPressed: () => app.toggleLike(p),
                style: TextButton.styleFrom(foregroundColor: p.liked ? UdecColors.red : UdecColors.muted),
                icon: Icon(p.liked ? Icons.favorite : Icons.favorite_border, size: 19),
                label: Text('${p.likes}'),
              ),
              TextButton.icon(
                onPressed: null,
                style: TextButton.styleFrom(disabledForegroundColor: UdecColors.muted),
                icon: const Icon(Icons.chat_bubble_outline, size: 18),
                label: Text('${p.comments.length}'),
              ),
            ],
          ),
          for (final c in p.comments)
            Container(
              width: double.infinity,
              margin: const EdgeInsets.only(bottom: 6),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
              decoration: BoxDecoration(color: UdecColors.surface2, borderRadius: BorderRadius.circular(10)),
              child: Text.rich(TextSpan(children: [
                TextSpan(text: '${c.author} ', style: const TextStyle(fontWeight: FontWeight.w700)),
                TextSpan(text: c.text),
              ]), style: const TextStyle(fontSize: 13.5)),
            ),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _comment,
                  onSubmitted: (_) => _sendComment(),
                  decoration: InputDecoration(
                    hintText: 'Escribe un comentario',
                    isDense: true,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(20)),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                      borderSide: const BorderSide(color: UdecColors.line),
                    ),
                  ),
                ),
              ),
              IconButton(
                tooltip: 'Comentar',
                onPressed: _sendComment,
                icon: const Icon(Icons.send_rounded, color: UdecColors.green),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _Banner extends StatelessWidget {
  final EventBanner b;
  const _Banner(this.b);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 4),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: b.color, borderRadius: BorderRadius.circular(14)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(b.title,
                    style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800, height: 1.1)),
                const SizedBox(height: 6),
                Text(b.subtitle, style: const TextStyle(color: Color(0xE6FFFFFF), fontSize: 13)),
              ],
            ),
          ),
          const SizedBox(width: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(color: const Color(0x2EFFFFFF), borderRadius: BorderRadius.circular(10)),
            child: Column(
              children: [
                Text(b.day, style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w800)),
                Text(b.month,
                    style: const TextStyle(color: Colors.white, fontSize: 11, letterSpacing: 0.8, fontWeight: FontWeight.w600)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';

import '../app_state.dart';
import '../models.dart';
import '../theme.dart';
import '../widgets.dart';

class ChatDetailScreen extends StatefulWidget {
  final String channelId;
  const ChatDetailScreen({super.key, required this.channelId});

  @override
  State<ChatDetailScreen> createState() => _ChatDetailScreenState();
}

class _ChatDetailScreenState extends State<ChatDetailScreen> {
  final _input = TextEditingController();
  AppState? _app;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _app = AppScope.read(context);
    _app!.viewingChannel = widget.channelId;
  }

  @override
  void dispose() {
    if (_app?.viewingChannel == widget.channelId) _app!.viewingChannel = null;
    _input.dispose();
    super.dispose();
  }

  void _send(Channel c) {
    final text = _input.text.trim();
    if (text.isEmpty) return;
    AppScope.read(context).sendMessage(c, text);
    _input.clear();
  }

  @override
  Widget build(BuildContext context) {
    final app = AppScope.of(context);
    final c = app.channel(widget.channelId);

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          titleSpacing: 0,
          title: Row(
            children: [
              InitialsAvatar(text: c.short, color: c.color, size: 38),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(c.name, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 16)),
                    Text('${c.members} integrantes · ${c.kind}',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Color(0xDDFFFFFF))),
                  ],
                ),
              ),
            ],
          ),
          bottom: const TabBar(
            indicatorColor: UdecColors.yellow,
            indicatorWeight: 3,
            labelColor: Colors.white,
            unselectedLabelColor: Color(0xBBFFFFFF),
            dividerColor: Colors.transparent,
            tabs: [Tab(text: 'Mensajes'), Tab(text: 'Archivos')],
          ),
        ),
        body: TabBarView(
          children: [
            _messagesTab(app, c),
            _filesTab(c),
          ],
        ),
      ),
    );
  }

  Widget _messagesTab(AppState app, Channel c) {
    final items = c.messages.reversed.toList();
    final typing = app.typingIn.contains(c.id);
    return Column(
      children: [
        if (c.pinned != null) _PinnedBanner(c.pinned!),
        Expanded(
          child: Container(
            color: UdecColors.surface2,
            child: ListView.builder(
              reverse: true,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
              itemCount: items.length + (typing ? 1 : 0),
              itemBuilder: (context, i) {
                if (typing && i == 0) return const _TypingBubble();
                final m = items[typing ? i - 1 : i];
                if (m.isDay) return _DayChip(m.day!);
                return _MessageBubble(
                  message: m,
                  isMe: m.author == app.me,
                  file: m.fileIndex == null ? null : c.files[m.fileIndex!],
                );
              },
            ),
          ),
        ),
        _composer(app, c),
      ],
    );
  }

  Widget _composer(AppState app, Channel c) {
    if (c.readOnly) {
      return const SafeArea(
        top: false,
        child: Padding(
          padding: EdgeInsets.all(14),
          child: Text(
            'Solo las cuentas oficiales pueden publicar en este canal',
            textAlign: TextAlign.center,
            style: TextStyle(color: UdecColors.muted, fontSize: 13),
          ),
        ),
      );
    }
    return SafeArea(
      top: false,
      child: Container(
        padding: const EdgeInsets.fromLTRB(6, 8, 10, 8),
        decoration: const BoxDecoration(border: Border(top: BorderSide(color: UdecColors.line))),
        child: Row(
          children: [
            IconButton(
              tooltip: 'Adjuntar archivo',
              icon: const Icon(Icons.attach_file, color: UdecColors.muted),
              onPressed: () {
                app.attachFile(c);
                showToast(context, 'Archivo guardado también en la pestaña Archivos');
              },
            ),
            Expanded(
              child: TextField(
                controller: _input,
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => _send(c),
                decoration: InputDecoration(
                  hintText: 'Escribe un mensaje',
                  isDense: true,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(22)),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(22),
                    borderSide: const BorderSide(color: UdecColors.line),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(22),
                    borderSide: const BorderSide(color: UdecColors.green),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            IconButton.filled(
              tooltip: 'Enviar',
              onPressed: () => _send(c),
              icon: const Icon(Icons.send_rounded),
            ),
          ],
        ),
      ),
    );
  }

  Widget _filesTab(Channel c) {
    return ListView(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 6),
          child: Text(
            'ARCHIVOS DE LA MATERIA (${c.files.length})',
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.9, color: UdecColors.muted),
          ),
        ),
        if (c.files.isEmpty)
          const Padding(
            padding: EdgeInsets.all(40),
            child: Text('Aún no hay archivos en este canal.', textAlign: TextAlign.center, style: TextStyle(color: UdecColors.muted)),
          ),
        for (final f in c.files)
          ListTile(
            leading: FileBadge(type: f.type, color: f.color),
            title: Text(f.name, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600)),
            subtitle: Text('${f.size} · Subido por ${f.uploadedBy}'),
            onTap: () => showToast(context, 'Abriendo ${f.name}'),
          ),
      ],
    );
  }
}

class _PinnedBanner extends StatelessWidget {
  final Pinned pinned;
  const _PinnedBanner(this.pinned);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: const BoxDecoration(
        color: UdecColors.yellowSoft,
        border: Border(bottom: BorderSide(color: UdecColors.line)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(top: 2),
            child: Icon(Icons.push_pin, size: 16, color: Color(0xFFB07F00)),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('FIJADO POR ${pinned.by.toUpperCase()}',
                    style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, letterSpacing: 0.6, color: UdecColors.muted)),
                const SizedBox(height: 2),
                Text(pinned.text, style: const TextStyle(fontSize: 13.5)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _DayChip extends StatelessWidget {
  final String label;
  const _DayChip(this.label);

  @override
  Widget build(BuildContext context) => Center(
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 8),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(8)),
          child: Text(label, style: const TextStyle(fontSize: 11.5, color: UdecColors.muted)),
        ),
      );
}

class _MessageBubble extends StatelessWidget {
  final Message message;
  final bool isMe;
  final ChatFile? file;
  const _MessageBubble({required this.message, required this.isMe, this.file});

  @override
  Widget build(BuildContext context) {
    final fg = isMe ? Colors.white : UdecColors.text;
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 320),
        margin: const EdgeInsets.symmetric(vertical: 3),
        padding: const EdgeInsets.fromLTRB(11, 7, 11, 5),
        decoration: BoxDecoration(
          color: isMe ? UdecColors.green : Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(14),
            topRight: const Radius.circular(14),
            bottomLeft: Radius.circular(isMe ? 14 : 4),
            bottomRight: Radius.circular(isMe ? 4 : 14),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            if (!isMe)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Flexible(
                    child: Text(message.author,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: UdecColors.greenDark)),
                  ),
                  if (message.role != null) ...[
                    const SizedBox(width: 6),
                    Pill.kind(message.role!),
                  ],
                ],
              ),
            if (file != null)
              Container(
                margin: const EdgeInsets.only(top: 4, bottom: 2),
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: isMe ? const Color(0x33FFFFFF) : UdecColors.surface2,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    FileBadge(type: file!.type, color: file!.color, width: 32),
                    const SizedBox(width: 8),
                    Flexible(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(file!.name, style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: fg)),
                          Text(file!.size, style: TextStyle(fontSize: 12, color: isMe ? const Color(0xCCFFFFFF) : UdecColors.muted)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            if (message.text.isNotEmpty)
              Text(message.text, style: TextStyle(fontSize: 14.5, height: 1.35, color: fg)),
            const SizedBox(height: 2),
            Align(
              alignment: Alignment.centerRight,
              widthFactor: 1,
              child: Text(message.time,
                  style: TextStyle(fontSize: 10.5, color: isMe ? const Color(0xBFFFFFFF) : UdecColors.muted)),
            ),
          ],
        ),
      ),
    );
  }
}

class _TypingBubble extends StatelessWidget {
  const _TypingBubble();

  @override
  Widget build(BuildContext context) => Align(
        alignment: Alignment.centerLeft,
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 3),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
          child: const Text('escribiendo…', style: TextStyle(fontStyle: FontStyle.italic, color: UdecColors.muted)),
        ),
      );
}

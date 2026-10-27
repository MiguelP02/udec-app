import 'package:flutter/material.dart';

import '../app_state.dart';
import '../models.dart';
import '../theme.dart';
import '../widgets.dart';
import 'chat_detail_screen.dart';

class ChatsScreen extends StatefulWidget {
  const ChatsScreen({super.key});

  @override
  State<ChatsScreen> createState() => _ChatsScreenState();
}

class _ChatsScreenState extends State<ChatsScreen> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final app = AppScope.of(context);
    final list = app.channels
        .where((c) => c.name.toLowerCase().contains(_query.toLowerCase()))
        .toList();

    return Scaffold(
      appBar: udecAppBar('UDEC APP', 'Chats por materia y grupo'),
      body: ListView(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: TextField(
              onChanged: (v) => setState(() => _query = v),
              decoration: InputDecoration(
                hintText: 'Buscar materia o grupo',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
          ),
          const _SectionLabel('TUS CANALES · SEMESTRE 2026-2'),
          if (list.isEmpty)
            const Padding(
              padding: EdgeInsets.all(40),
              child: Text('No hay canales con ese nombre.', textAlign: TextAlign.center, style: TextStyle(color: UdecColors.muted)),
            ),
          for (final c in list) _ChannelTile(channel: c),
        ],
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String text;
  const _SectionLabel(this.text);

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 6),
        child: Text(
          text,
          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.9, color: UdecColors.muted),
        ),
      );
}

class _ChannelTile extends StatelessWidget {
  final Channel channel;
  const _ChannelTile({required this.channel});

  String _preview(Message? m) {
    if (m == null) return '';
    final first = m.author.split(' ').first;
    final body = m.text.isEmpty && m.fileIndex != null ? 'Archivo' : m.text;
    return '$first: $body';
  }

  @override
  Widget build(BuildContext context) {
    final last = channel.lastMessage;
    return InkWell(
      onTap: () {
        AppScope.read(context).markRead(channel);
        Navigator.of(context).push(MaterialPageRoute(
          builder: (_) => ChatDetailScreen(channelId: channel.id),
        ));
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: Row(
          children: [
            InitialsAvatar(text: channel.short, color: channel.color),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(channel.name,
                            overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                      ),
                      Text(last?.time ?? '', style: const TextStyle(fontSize: 12, color: UdecColors.muted)),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      Expanded(
                        child: Text(_preview(last),
                            overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 13.5, color: UdecColors.muted)),
                      ),
                      if (channel.unread > 0)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 1),
                          decoration: BoxDecoration(color: UdecColors.green, borderRadius: BorderRadius.circular(10)),
                          child: Text('${channel.unread}',
                              style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700)),
                        ),
                    ],
                  ),
                  const SizedBox(height: 5),
                  Pill.kind(channel.kind),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

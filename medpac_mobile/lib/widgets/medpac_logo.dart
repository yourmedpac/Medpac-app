import 'package:flutter/material.dart';

class MedpacLogoPainter extends CustomPainter {
  final Color color;
  MedpacLogoPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    // Scale from 30x30 viewbox to actual widget size
    final double scaleX = size.width / 30.0;
    final double scaleY = size.height / 30.0;

    // Path 1
    final path1 = Path();
    path1.moveTo(15.47 * scaleX, 7.1 * scaleY);
    path1.lineTo(14.17 * scaleX, 8.95 * scaleY);
    path1.lineTo(6.17 * scaleX, 9.42 * scaleY);
    path1.lineTo(6.17 * scaleX, 7.09 * scaleY);
    path1.close();
    canvas.drawPath(path1, paint);

    // Polygon
    final pathPoly = Path();
    pathPoly.moveTo(24.3 * scaleX, 7.1 * scaleY);
    pathPoly.lineTo(13.14 * scaleX, 22.91 * scaleY);
    pathPoly.lineTo(5.7 * scaleX, 22.91 * scaleY);
    pathPoly.lineTo(16.86 * scaleX, 7.1 * scaleY);
    pathPoly.close();
    canvas.drawPath(pathPoly, paint);

    // Path 2
    final path2 = Path();
    path2.moveTo(14.53 * scaleX, 22.91 * scaleY);
    path2.lineTo(15.84 * scaleX, 21.05 * scaleY);
    path2.lineTo(23.83 * scaleX, 20.58 * scaleY);
    path2.lineTo(23.83 * scaleX, 22.91 * scaleY);
    path2.close();
    canvas.drawPath(path2, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class MedpacLogo extends StatelessWidget {
  final double size;
  final bool showBackground;
  final Color? color;

  const MedpacLogo({
    super.key,
    this.size = 40.0,
    this.showBackground = true,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final logoColor = color ?? (showBackground ? Colors.white : const Color(0xFF006565));

    Widget logoMark = CustomPaint(
      size: Size(size, size),
      painter: MedpacLogoPainter(color: logoColor),
    );

    if (!showBackground) {
      return logoMark;
    }

    return Container(
      width: size * 1.5,
      height: size * 1.5,
      decoration: BoxDecoration(
        color: const Color(0xFF006565),
        borderRadius: BorderRadius.circular(size * 0.4),
        border: Border.all(
          color: const Color(0xFF004D4D),
          width: size * 0.03,
        ),
      ),
      alignment: Alignment.center,
      child: logoMark,
    );
  }
}

import 'package:flutter/material.dart';
import 'package:student_search_app/utils/constants.dart';

class SearchForm extends StatefulWidget {
  final TextEditingController controller;
  final Function(String) onSearch;

  const SearchForm({
    super.key,
    required this.controller,
    required this.onSearch,
  });

  @override
  State<SearchForm> createState() => _SearchFormState();
}

class _SearchFormState extends State<SearchForm> {
  bool _isValid = false;

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_validateInput);
  }

  @override
  void dispose() {
    widget.controller.removeListener(_validateInput);
    super.dispose();
  }

  void _validateInput() {
    final isValid = widget.controller.text.length >= 2;
    if (_isValid != isValid) {
      setState(() {
        _isValid = isValid;
      });
    }
  }

  void _handleSearch() {
    if (_isValid) {
      widget.onSearch(widget.controller.text.trim());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Search Input
        Container(
          width: double.infinity,
          constraints: const BoxConstraints(maxWidth: 400),
          child: TextField(
            controller: widget.controller,
            decoration: InputDecoration(
              hintText: 'ادخل كود الطالب',
              hintStyle: const TextStyle(
                color: Colors.grey,
                fontStyle: FontStyle.italic,
              ),
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(color: AppColors.inputBorderColor),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(color: AppColors.inputBorderColor),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(color: AppColors.accent, width: 2),
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 12,
              ),
              suffixIcon: widget.controller.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        widget.controller.clear();
                        setState(() {});
                      },
                    )
                  : null,
            ),
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
            onSubmitted: (_) => _handleSearch(),
            textInputAction: TextInputAction.search,
          ),
        ),
        const SizedBox(height: 12),

        // Search Button
        SizedBox(
          width: double.infinity,
          constraints: const BoxConstraints(maxWidth: 200),
          height: AppSizes.buttonHeight,
          child: ElevatedButton(
            onPressed: _isValid ? _handleSearch : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.buttonColor,
              foregroundColor: Colors.white,
              disabledBackgroundColor: AppColors.buttonColor.withOpacity(0.6),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              elevation: 2,
            ),
            child: const Text(
              'بحث',
              style: AppTextStyles.buttonText,
            ),
          ),
        ),

        // Keyboard shortcuts info
        const SizedBox(height: 8),
        const Text(
          'Press Enter to search • Press Escape to clear',
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }
}

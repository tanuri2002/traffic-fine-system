/// Test data for payment testing

class TestCard {
  final String cardNumber;
  final String expiryDate;
  final String cvv;
  final String cardholderName;
  final String status;
  final String description;

  TestCard({
    required this.cardNumber,
    required this.expiryDate,
    required this.cvv,
    required this.cardholderName,
    required this.status,
    required this.description,
  });
}

class TestPaymentCards {
  static final List<TestCard> testCards = [
    TestCard(
      cardNumber: '1111111111111111',
      expiryDate: '12/25',
      cvv: '123',
      cardholderName: 'TEST USER',
      status: 'Success',
      description: 'Payment successful',
    ),
    TestCard(
      cardNumber: '2222222222222222',
      expiryDate: '06/26',
      cvv: '456',
      cardholderName: 'DECLINE TEST',
      status: 'Declined',
      description: 'Card declined by issuer',
    ),
    TestCard(
      cardNumber: '3333333333333333',
      expiryDate: '09/24',
      cvv: '789',
      cardholderName: 'EXPIRED TEST',
      status: 'Expired',
      description: 'Card expired',
    ),
    TestCard(
      cardNumber: '4444444444444444',
      expiryDate: '03/27',
      cvv: '321',
      cardholderName: 'LIMIT EXCEEDED',
      status: 'Limit Exceeded',
      description: 'Transaction limit exceeded',
    ),
    TestCard(
      cardNumber: '5555555555555555',
      expiryDate: '11/25',
      cvv: '654',
      cardholderName: 'PROCESSING ERROR',
      status: 'Error',
      description: 'Processing error occurred',
    ),
  ];

  static TestCard? getTestCard(String cardNumber) {
    try {
      return testCards.firstWhere(
        (card) => card.cardNumber == cardNumber.replaceAll(' ', ''),
      );
    } catch (e) {
      return null;
    }
  }

  static String getTestCardDescription() {
    return '''
TEST CARD NUMBERS:

✓ SUCCESS:
  1111111111111111 | 12/25 | 123
  
✗ DECLINED:
  2222222222222222 | 06/26 | 456
  
✗ EXPIRED:
  3333333333333333 | 09/24 | 789
  
✗ LIMIT EXCEEDED:
  4444444444444444 | 03/27 | 321
  
✗ PROCESSING ERROR:
  5555555555555555 | 11/25 | 654
''';
  }
}

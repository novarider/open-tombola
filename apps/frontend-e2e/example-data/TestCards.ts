import { faker } from "@faker-js/faker";

export interface Card {
    cardnr: string;
    cvc: string;
    exp: string;
}
export class TestCards {
    static readonly VISA: Card = {
        cardnr: "4242424242424242",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly VISA_DEBIT: Card = {
        cardnr: "4000056655665556",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly MASTERCARD: Card = {
        cardnr: "5555555555554444",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly MASTERCARD_2ER_REIHE: Card = {
        cardnr: "2223003122003222",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly MASTERCARD_DEBIT: Card = {
        cardnr: "5200828282828210",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly MASTERCARD_PREPAID: Card = {
        cardnr: "5105105105105100",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly AMERICAN_EXPRESS_1: Card = {
        cardnr: "378282246310005",
        cvc: "1234",
        exp: "12 / 32",
    };

    static readonly AMERICAN_EXPRESS_2: Card = {
        cardnr: "371449635398431",
        cvc: "1234",
        exp: "12 / 32",
    };

    static readonly DISCOVER_1: Card = {
        cardnr: "6011111111111117",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly DISCOVER_2: Card = {
        cardnr: "6011000990139424",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly DISCOVER_DEBIT: Card = {
        cardnr: "6011981111111113",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly DINERS_CLUB: Card = {
        cardnr: "3056930009020004",
        cvc: "3",
        exp: "12 / 32",
    };

    static readonly DINERS_CLUB_14_STELLIG: Card = {
        cardnr: "36227206271667",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly BCARD_N_DINACARD: Card = {
        cardnr: "6555900000604105",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly JCB: Card = {
        cardnr: "3566002020360505",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly UNIONPAY: Card = {
        cardnr: "6200000000000005",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly UNIONPAY_DEBIT: Card = {
        cardnr: "6200000000000047",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly UNIONPAY_19_STELLIG: Card = {
        cardnr: "6205500000000000004",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly VISA_AUSTRIA: Card = {
        cardnr: "4000000400000008",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly VISA_GERMANY: Card = {
        cardnr: "4000002760000016",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly DECLINED_GENERIC: Card = {
        cardnr: "4000000000000002",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly DECLINED_NOT_COVERED: Card = {
        cardnr: "4000000000009995",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly DECLINED_LOST: Card = {
        cardnr: "4000000000009987",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly DECLINED_STOLEN: Card = {
        cardnr: "4000000000009979",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly DECLINED_EXPIRED: Card = {
        cardnr: "4000000000000069",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly DECLINED_INCORRECT_CVC: Card = {
        cardnr: "4000000000000127",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly DECLINED_PROCESSING_ERROR: Card = {
        cardnr: "4000000000000119",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly DECLINED_INCORRECT_NUMBER: Card = {
        cardnr: "4242424242424241",
        cvc: "123",
        exp: "12 / 32",
    };

    static readonly DECLINED_VELOCITY_EXCEEDED: Card = {
        cardnr: "4000000000006975",
        cvc: "123",
        exp: "12 / 32",
    };

    public static getRandomCard(): Card {
        return faker.helpers.arrayElement(TestCards.allCards);
    }

    private static allCards: Card[] = [
        TestCards.VISA,
        TestCards.VISA_DEBIT,
        TestCards.MASTERCARD,
        TestCards.MASTERCARD_2ER_REIHE,
        TestCards.MASTERCARD_DEBIT,
        TestCards.MASTERCARD_PREPAID,
        TestCards.AMERICAN_EXPRESS_1,
        TestCards.AMERICAN_EXPRESS_2,
        TestCards.DISCOVER_1,
        TestCards.DISCOVER_2,
        TestCards.DISCOVER_DEBIT,
        TestCards.DINERS_CLUB,
        TestCards.DINERS_CLUB_14_STELLIG,
        TestCards.BCARD_N_DINACARD,
        TestCards.JCB,
        TestCards.UNIONPAY,
        TestCards.UNIONPAY_DEBIT,
        TestCards.UNIONPAY_19_STELLIG
    ];
}
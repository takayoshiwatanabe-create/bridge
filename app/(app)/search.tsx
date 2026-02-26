import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { I18nContext } from "@/i18n/I18nContext";
import { DisclaimerBadge } from "@/components/DisclaimerBadge";
import { Instrument } from "@/types";

export default function SearchScreen() {
  const { t, isRTL } = useContext(I18nContext);
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const mockInstruments: Instrument[] = [
    { id: "AAPL_ID", symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", currency: "USD" },
    { id: "MSFT_ID", symbol: "MSFT", name: "Microsoft Corp.", exchange: "NASDAQ", currency: "USD" },
    { id: "GOOGL_ID", symbol: "GOOGL", name: "Alphabet Inc. (Class A)", exchange: "NASDAQ", currency: "USD" },
    { id: "AMZN_ID", symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", currency: "USD" },
    { id: "TSLA_ID", symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", currency: "USD" },
    { id: "NVDA_ID", symbol: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", currency: "USD" },
    { id: "JPM_ID", symbol: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE", currency: "USD" },
    { id: "V_ID", symbol: "V", name: "Visa Inc.", exchange: "NYSE", currency: "USD" },
    { id: "PG_ID", symbol: "PG", name: "Procter & Gamble Co.", exchange: "NYSE", currency: "USD" },
    { id: "TM_ID", symbol: "TM", name: "Toyota Motor Corp.", exchange: "NYSE", currency: "USD" },
  ];

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

    const filteredResults = mockInstruments.filter(
      (instrument) =>
        instrument.symbol.toLowerCase().includes(text.toLowerCase()) ||
        instrument.name.toLowerCase().includes(text.toLowerCase())
    );
    setSearchResults(filteredResults);
    setLoading(false);
  };

  const handleSelectStock = (symbol: string) => {
    router.push(`/(app)/stock/${symbol}`);
  };

  const renderItem = ({ item }: { item: Instrument }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectStock(item.symbol)}>
      <Text style={[styles.resultSymbol, isRTL && styles.rtlText]}>{item.symbol}</Text>
      <Text style={[styles.resultName, isRTL && styles.rtlText]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <Stack.Screen options={{ title: t("search.title") }} />
      <DisclaimerBadge />

      <Text style={[styles.header, isRTL && styles.rtlText]}>{t("search.title")}</Text>

      <TextInput
        style={[styles.searchInput, isRTL && styles.rtlInput]}
        placeholder={t("search.placeholder")}
        value={searchText}
        onChangeText={handleSearch}
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            searchText.trim().length > 0 && !loading ? (
              <Text style={[styles.emptyListText, isRTL && styles.rtlText]}>{t("search.no_results")}</Text>
            ) : null
          }
          style={styles.resultsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  rtlContainer: {
    direction: "rtl",
  },
  rtlText: {
    textAlign: "right",
  },
  header: {
    fontSize: 28, // H1: 32px, Bold - Adjusted to H1 spec
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333", // Text Primary
  },
  searchInput: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  rtlInput: {
    textAlign: "right",
  },
  loadingIndicator: {
    marginTop: 20,
  },
  resultsList: {
    flex: 1,
  },
  resultItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  resultSymbol: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  resultName: {
    fontSize: 14,
    color: "#666",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});


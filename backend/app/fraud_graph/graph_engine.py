"""
TrustLedger Fraud Graph Engine
Uses NetworkX to build, traverse, and cluster multi-application entity networks:
Nodes: Applicant, Application, Device, IP, Bank Account, Email, Phone.
Analyzes shared digital signals and outputs React Flow compatible graph telemetry.
"""

from typing import Dict, Any, List, Optional
import networkx as nx


class FraudGraphEngine:
    """NetworkX-powered fraud network analysis and entity clustering."""

    def __init__(self):
        self._knowledge_graph = nx.Graph()
        self._seed_default_syndicate_graph()

    def _seed_default_syndicate_graph(self):
        """
        Seeds baseline multi-application network:
        - TL-APP-10001 (Arjun Kumar)
        - Connected Device-7F2A shared with TL-APP-10004 (Ananya Rao) and APP-10003 (Rahul Verma)
        - Shared IP (192.168.1.104) and Virtual VoIP (+91 98123 45678)
        - Bank Account cluster
        """
        G = nx.Graph()

        # Nodes definition: (node_id, attributes)
        nodes = [
            # Applications
            ("APP_TL10001", {"label": "TL-APP-10001", "type": "application", "subtext": "Arjun Kumar (₹2,00,000)", "risk": "critical"}),
            ("APP_TL10004", {"label": "TL-APP-10004", "type": "application", "subtext": "Ananya Rao (₹1,50,000)", "risk": "warning"}),
            ("APP_TL10003", {"label": "TL-APP-10003", "type": "application", "subtext": "Rahul Verma (₹5,00,000)", "risk": "critical"}),
            ("APP_TL10002", {"label": "TL-APP-10002", "type": "application", "subtext": "Priya Sharma (₹75,000)", "risk": "safe"}),

            # Applicants
            ("USR_ARJUN", {"label": "Arjun Kumar", "type": "applicant", "subtext": "Lead Applicant", "risk": "critical"}),
            ("USR_ANANYA", {"label": "Ananya Rao", "type": "applicant", "subtext": "Co-applicant match", "risk": "warning"}),
            ("USR_RAHUL", {"label": "Rahul Verma", "type": "applicant", "subtext": "Cross-application entity", "risk": "critical"}),
            ("USR_PRIYA", {"label": "Priya Sharma", "type": "applicant", "subtext": "Independent entity", "risk": "safe"}),

            # Shared Digital Signals (Devices, IPs, Phones, Banks)
            ("DEV_7F2A", {"label": "Device: Pixel-7A (ID: 7F2A)", "type": "device", "subtext": "IMEI shared across 3 applications", "risk": "critical"}),
            ("IP_104", {"label": "IP: 49.37.152.104 (Static/VPN)", "type": "ip", "subtext": "Residential Proxy Subnet", "risk": "warning"}),
            ("PHONE_ARJUN", {"label": "Phone: +91 98123 45678", "type": "phone", "subtext": "Virtual VoIP gateway match", "risk": "warning"}),
            ("BANK_4821", {"label": "Bank: HDFC •••• 4821", "type": "bank", "subtext": "Rapid turnover payout account", "risk": "critical"}),
            ("EMAIL_DOMAIN", {"label": "Email: @example.in", "type": "email", "subtext": "Disposal domain pattern", "risk": "warning"}),

            # Clean entities for Priya
            ("DEV_PRIYA", {"label": "Device: Samsung S23", "type": "device", "subtext": "Single user device signature", "risk": "safe"}),
            ("BANK_PRIYA", {"label": "Bank: ICICI •••• 8821", "type": "bank", "subtext": "Verified salary account", "risk": "safe"}),
        ]

        for n_id, attrs in nodes:
            G.add_node(n_id, **attrs)

        # Edges
        edges = [
            # Arjun -> Application
            ("USR_ARJUN", "APP_TL10001", {"weight": 1.0, "relation": "SUBMITTED"}),
            # Arjun -> Phone, Email, Bank
            ("APP_TL10001", "PHONE_ARJUN", {"weight": 0.8, "relation": "USES_PHONE"}),
            ("APP_TL10001", "EMAIL_DOMAIN", {"weight": 0.6, "relation": "USES_EMAIL"}),
            ("APP_TL10001", "BANK_4821", {"weight": 0.9, "relation": "PAYOUT_ACCOUNT"}),

            # Device-7F2A is shared across TL-APP-10001, TL-APP-10004, and TL-APP-10003!
            ("APP_TL10001", "DEV_7F2A", {"weight": 1.0, "relation": "ORIGINATED_ON"}),
            ("APP_TL10004", "DEV_7F2A", {"weight": 1.0, "relation": "ORIGINATED_ON"}),
            ("APP_TL10003", "DEV_7F2A", {"weight": 1.0, "relation": "ORIGINATED_ON"}),

            # IP overlap
            ("APP_TL10001", "IP_104", {"weight": 0.7, "relation": "CONNECTED_FROM"}),
            ("APP_TL10004", "IP_104", {"weight": 0.7, "relation": "CONNECTED_FROM"}),

            # Ananya & Rahul connections
            ("USR_ANANYA", "APP_TL10004", {"weight": 1.0, "relation": "SUBMITTED"}),
            ("USR_RAHUL", "APP_TL10003", {"weight": 1.0, "relation": "SUBMITTED"}),

            # Priya (isolated clean graph)
            ("USR_PRIYA", "APP_TL10002", {"weight": 1.0, "relation": "SUBMITTED"}),
            ("APP_TL10002", "DEV_PRIYA", {"weight": 1.0, "relation": "ORIGINATED_ON"}),
            ("APP_TL10002", "BANK_PRIYA", {"weight": 1.0, "relation": "PAYOUT_ACCOUNT"}),
        ]

        for u, v, attrs in edges:
            G.add_edge(u, v, **attrs)

        self._knowledge_graph = G

    def get_application_subgraph(self, application_id: str) -> Dict[str, Any]:
        """
        Extracts k-hop neighborhood around application_id, converts to React Flow format.
        Computes degree centrality and connected digital signals analysis.
        """
        # Map common application id formats
        app_node_id = None
        clean_id = application_id.replace("-", "_").upper()
        if clean_id in self._knowledge_graph:
            app_node_id = clean_id
        elif f"APP_{clean_id}" in self._knowledge_graph:
            app_node_id = f"APP_{clean_id}"
        elif f"APP_{application_id.replace('-', '')}" in self._knowledge_graph:
            app_node_id = f"APP_{application_id.replace('-', '')}"
        else:
            # Fallback to TL10001
            app_node_id = "APP_TL10001"

        # Find 2-hop ego network using NetworkX
        ego = nx.ego_graph(self._knowledge_graph, app_node_id, radius=2)

        # Count shared applications connected to the same device/IP/bank
        shared_apps = [n for n, d in ego.nodes(data=True) if d.get("type") == "application" and n != app_node_id]
        shared_count = len(shared_apps) + 1

        # Position layout mapping for React Flow (fixed or spring layout)
        layout = nx.spring_layout(ego, seed=42, k=1.8)

        nodes_rf = []
        for node_id, data in ego.nodes(data=True):
            pos = layout.get(node_id, (0.5, 0.5))
            # Scale coordinates for React Flow canvas (width ~750, height ~450)
            x = int((pos[0] + 1.0) * 320) + 50
            y = int((pos[1] + 1.0) * 180) + 40

            nodes_rf.append({
                "id": node_id,
                "type": "entity",
                "position": {"x": x, "y": y},
                "data": {
                    "label": data.get("label", node_id),
                    "type": data.get("type", "entity"),
                    "subtext": data.get("subtext", ""),
                    "risk": data.get("risk", "safe")
                }
            })

        edges_rf = []
        for idx, (u, v, data) in enumerate(ego.edges(data=True)):
            # Edge styling based on risk of endpoints
            u_risk = ego.nodes[u].get("risk", "safe")
            v_risk = ego.nodes[v].get("risk", "safe")
            is_critical = "critical" in (u_risk, v_risk)
            is_warning = "warning" in (u_risk, v_risk)

            stroke_color = "#ef4444" if is_critical else ("#f59e0b" if is_warning else "#00f0ff")

            edges_rf.append({
                "id": f"e_{u}_{v}_{idx}",
                "source": u,
                "target": v,
                "animated": is_critical,
                "label": data.get("relation", ""),
                "style": {
                    "stroke": stroke_color,
                    "strokeWidth": 2 if is_critical else 1.5
                }
            })

        summary_msg = (
            f"{shared_count} applications share connected digital signals."
            if shared_count > 1
            else "Single isolated application. No cross-application signal sharing detected."
        )

        return {
            "application_id": application_id,
            "target_node": app_node_id,
            "nodes": nodes_rf,
            "edges": edges_rf,
            "shared_applications_count": shared_count,
            "connected_applications": shared_apps,
            "summary": summary_msg,
            "disclaimer": "Connected digital signals require investigation. Shared device, IP, or network information alone does not prove fraud.",
            "is_prototype": True
        }


fraud_graph_engine = FraudGraphEngine()

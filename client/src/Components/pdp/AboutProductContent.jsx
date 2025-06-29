"use client";
import Typography from '@mui/material/Typography';

const AboutProductContent = ({ product }) => {
  if (!product) return null;
  const specRows = [
    ['Origin', product.origin],
    ['Wrapper', product.wrapperType],
    ['Strength', product.strength],
    ['Format', product.subCatName || product.format],
    ['Ring Gauge', product.ringGauge ? `${product.ringGauge}` : null],
    ['Length', product.lengthInInches ? `${product.lengthInInches} inches` : null],
    ['Box Count', product.boxType]
  ].filter(([, val]) => val);
  return (
    <div className="about-product-content">
      {product.description && (
        <Typography className="mb-3" variant="body1">
          {product.highlight || product.description}
        </Typography>
      )}
      {specRows.length > 0 && (
        <div className="spec-table mb-3">
          <table>
            <tbody>
              {specRows.map(([label, value]) => (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {Array.isArray(product.badgeIcons) && product.badgeIcons.length > 0 && (
        <div className="badge-list mb-3">
          {product.badgeIcons.map((tag, idx) => (
            <span key={idx} className="tag-badge">#{tag}</span>
          ))}
        </div>
      )}
      {Array.isArray(product.flavorNotes) && product.flavorNotes.length > 0 && (
        <div className="flavor-profile mb-3">
          <Typography variant="h6" component="h3" className="section-title">Flavor Profile</Typography>
          <ul>
            {product.flavorNotes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
      {Array.isArray(product.pairingSuggestions) && product.pairingSuggestions.length > 0 && (
        <div className="pairing-suggestions mb-3">
          <Typography variant="h6" component="h3" className="section-title">Pairs well with</Typography>
          <Typography variant="body2">{product.pairingSuggestions.join(', ')}</Typography>
        </div>
      )}
      <div className="user-tips mb-3">
        <Typography variant="h6" component="h3" className="section-title">User Tips</Typography>
        <ul>
          <li>Store in humidor at 68–72% RH</li>
          <li>Cut using a sharp guillotine cutter</li>
          <li>Light evenly with soft flame</li>
        </ul>
      </div>
      {Array.isArray(product.trustLabels) && product.trustLabels.length > 0 && (
        <div className="trust-labels mb-3">
          {product.trustLabels.map((label, idx) => (
            <span key={idx} className="tag-badge">{label}</span>
          ))}
        </div>
      )}
      {product.complianceNotes && (
        <Typography variant="body2" className="compliance-note mb-2">
          {product.complianceNotes}
        </Typography>
      )}
      <Typography variant="body2" className="trust-statement">
        All cigars are 100% authentic and directly sourced from licensed distributors.
      </Typography>
    </div>
  );
};

export default AboutProductContent;
